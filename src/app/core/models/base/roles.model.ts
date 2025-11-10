export enum Roles {
  ROLE_CLIENT = 'ROLE_CLIENT',
  ROLE_WAITER = 'ROLE_WAITER',
  ROLE_CHEF = 'ROLE_CHEF',
  ROLE_CASHIER = 'ROLE_CASHIER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_SUPPLIER = 'ROLE_SUPPLIER',
  ROLE_MANAGER = 'ROLE_MANAGER',
}

export const roleLabels: Record<Roles, string> = {
  ROLE_CLIENT: 'Cliente',
  ROLE_WAITER: 'Mesero',
  ROLE_CHEF: 'Cocinero',
  ROLE_CASHIER: 'Cajero',
  ROLE_SUPPLIER: 'Proveedor',
  ROLE_ADMIN: 'Administrador',
  ROLE_MANAGER: "Gerente"
};
