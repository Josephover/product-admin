export enum ChangeType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  DELETED = 'DELETED'
}

export interface OrderChange {
  id?: number;
  orderId: number;
  orderNumber: string;
  changeType: ChangeType;
  changeDescription: string;
  changedBy: string;
  createdAt: number;
}

export const ChangeTypeDisplayNames: { [key in ChangeType]: string } = {
  [ChangeType.CREATED]: 'Orden Creada',
  [ChangeType.UPDATED]: 'Orden Actualizada',
  [ChangeType.STATUS_CHANGED]: 'Estado Cambiado',
  [ChangeType.DELETED]: 'Orden Eliminada'
};

export const ChangeTypeIcons: { [key in ChangeType]: string } = {
  [ChangeType.CREATED]: 'add_circle',
  [ChangeType.UPDATED]: 'edit',
  [ChangeType.STATUS_CHANGED]: 'autorenew',
  [ChangeType.DELETED]: 'delete'
};

export const ChangeTypeColors: { [key in ChangeType]: string } = {
  [ChangeType.CREATED]: 'success',
  [ChangeType.UPDATED]: 'info',
  [ChangeType.STATUS_CHANGED]: 'warning',
  [ChangeType.DELETED]: 'danger'
};
