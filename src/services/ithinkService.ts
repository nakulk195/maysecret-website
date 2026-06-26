import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../utils/safeAsync';

export interface IthinkFunctionResult<T = any> {
  success: boolean;
  order?: T;
  orders?: T[];
  response?: any;
  message?: string;
  error?: string;
}

type IthinkAction = 'create_shipment' | 'track_order' | 'admin_orders';

export class IthinkService {
  private static async invoke<T>(
    action: IthinkAction,
    payload: Record<string, any> = {}
  ): Promise<IthinkFunctionResult<T>> {
    const { data, error } = await supabase.functions.invoke('ithink-logistics', {
      body: { action, ...payload },
    });

    if (error) {
      console.error(`[ithinkService] ${action} failed:`, error);
      return { success: false, error: error.message };
    }

    return data as IthinkFunctionResult<T>;
  }

  static async createShipment(orderId: string) {
    return this.invoke('create_shipment', { orderId });
  }

  static async trackOrder(orderId: string) {
    return this.invoke('track_order', { orderId });
  }

  static async getAdminOrders() {
    return this.invoke('admin_orders');
  }

  static async createShipmentWithoutBlockingOrder(orderId: string) {
    try {
      const result = await this.createShipment(orderId);
      if (!result.success) {
        console.error('[ithinkService] Shipment creation did not complete:', result.error);
      }
      return result;
    } catch (error) {
      console.error('[ithinkService] Shipment creation failed:', getErrorMessage(error));
      return { success: false, error: getErrorMessage(error) };
    }
  }
}

export const ithinkService = IthinkService;

