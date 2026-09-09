export const METHODS = ['Cash', 'UPI', 'Bank', 'Other'];

export const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
export const periodOf = date => String(date).slice(0, 7);
export const today = () => new Date().toISOString().slice(0, 10);
export const currentPeriod = () => today().slice(0, 7);
export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value) || 0);
export const displayDate = value => value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`)) : '—';
export const periodLabel = period => new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(`${period}-01T00:00:00`));

export function emptyState() {
  return { version: 1, employees: [], transactions: [], settlements: [], salaryHistory: [], settings: { companyName: 'My Company', defaultMethod: 'Cash', salaryPeriod: 'Calendar month' } };
}

export function employeeSalaryAt(state, employee, period) {
  const settled = state.settlements.find(s => s.employeeId === employee.id && s.period === period);
  if (settled) return Number(settled.salarySnapshot);
  const changes = state.salaryHistory.filter(h => h.employeeId === employee.id && h.effectivePeriod <= period).sort((a, b) => b.effectivePeriod.localeCompare(a.effectivePeriod));
  return Number(changes[0]?.salary ?? employee.monthlySalary);
}

export function activeTransactions(state, filters = {}) {
  return state.transactions.filter(t => !t.reversed && (!filters.period || t.period === filters.period) && (!filters.employeeId || t.employeeId === filters.employeeId));
}

export function employeeSummary(state, employee, period) {
  const settlement = state.settlements.find(s => s.employeeId === employee.id && s.period === period);
  const salary = employeeSalaryAt(state, employee, period);
  const advances = settlement ? Number(settlement.advancesSnapshot) : activeTransactions(state, { employeeId: employee.id, period }).reduce((sum, t) => sum + Number(t.amount), 0);
  const adjustments = Number(settlement?.adjustments || 0);
  const payable = salary - advances + adjustments;
  const paid = Number(settlement?.amountPaid || 0);
  const status = paid <= 0 ? 'Pending' : paid >= payable ? 'Paid' : 'Partially Paid';
  return { salary, advances, adjustments, payable, paid, status, settlement };
}

export function companySummary(state, period) {
  const employees = state.employees.filter(e => e.active || state.transactions.some(t => t.employeeId === e.id && t.period === period));
  const rows = employees.map(employee => ({ employee, ...employeeSummary(state, employee, period) }));
  return { rows, activeCount: state.employees.filter(e => e.active).length, salary: rows.reduce((s, r) => s + r.salary, 0), advances: rows.reduce((s, r) => s + r.advances, 0), payable: rows.reduce((s, r) => s + r.payable, 0), paid: rows.reduce((s, r) => s + r.paid, 0) };
}

export function validateEmployee(input) {
  if (!String(input.name || '').trim()) throw new Error('Employee name is required.');
  if (!Number.isFinite(Number(input.monthlySalary)) || Number(input.monthlySalary) < 0) throw new Error('Enter a valid monthly salary.');
  if (!input.joiningDate) throw new Error('Joining date is required.');
}

export function addEmployee(state, input) {
  validateEmployee(input);
  const sequence = Math.max(0, ...state.employees.map(e => Number(e.employeeCode?.replace(/\D/g, '')) || 0)) + 1;
  const employee = { id: uid('emp'), employeeCode: `EMP-${String(sequence).padStart(4, '0')}`, name: input.name.trim(), mobile: input.mobile?.trim() || '', monthlySalary: Number(input.monthlySalary), joiningDate: input.joiningDate, department: input.department?.trim() || '', notes: input.notes?.trim() || '', active: true, createdAt: new Date().toISOString() };
  state.employees.push(employee);
  state.salaryHistory.push({ id: uid('sal'), employeeId: employee.id, salary: employee.monthlySalary, effectivePeriod: periodOf(employee.joiningDate), createdAt: employee.createdAt });
  return employee;
}

export function addAdvance(state, input) {
  const employee = state.employees.find(e => e.id === input.employeeId && e.active);
  if (!employee) throw new Error('Select an active employee.');
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Amount must be greater than zero.');
  if (!input.date) throw new Error('Payment date is required.');
  if (!METHODS.includes(input.method)) throw new Error('Select a valid payment method.');
  if (state.settlements.some(s => s.employeeId === employee.id && s.period === periodOf(input.date))) throw new Error('This salary period is settled. Reopen the settlement before adding a payment.');
  if (input.requestId && state.transactions.some(t => t.requestId === input.requestId)) throw new Error('This payment was already saved.');
  const transaction = { id: uid('txn'), requestId: input.requestId || uid('req'), employeeId: employee.id, amount, date: input.date, period: periodOf(input.date), method: input.method, note: input.note?.trim() || '', reversed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  state.transactions.push(transaction);
  return transaction;
}

export function reverseTransaction(state, id, reason) {
  const transaction = state.transactions.find(t => t.id === id);
  if (!transaction || transaction.reversed) throw new Error('Transaction cannot be reversed.');
  if (!String(reason || '').trim()) throw new Error('A reversal reason is required.');
  transaction.reversed = true;
  transaction.reversalReason = reason.trim();
  transaction.updatedAt = new Date().toISOString();
}

export function settle(state, employeeId, period, input) {
  const employee = state.employees.find(e => e.id === employeeId);
  if (!employee) throw new Error('Employee not found.');
  const existing = state.settlements.find(s => s.employeeId === employeeId && s.period === period);
  const summary = employeeSummary(state, employee, period);
  const amountPaid = Number(input.amountPaid);
  if (!Number.isFinite(amountPaid) || amountPaid < 0) throw new Error('Enter a valid paid amount.');
  const record = existing || { id: uid('set'), employeeId, period, createdAt: new Date().toISOString() };
  Object.assign(record, { salarySnapshot: existing?.salarySnapshot ?? summary.salary, advancesSnapshot: summary.advances, adjustments: Number(input.adjustments || 0), amountPaid, paymentDate: input.paymentDate, method: input.method, notes: input.notes?.trim() || '', updatedAt: new Date().toISOString() });
  if (!existing) state.settlements.push(record);
  return record;
}
