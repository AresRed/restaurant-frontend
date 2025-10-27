import { InventoryResponse } from '../products/inventory/inventory.model';
import { ReservationResponse } from '../reservation.model';
import { ReviewResponse } from '../review.model';

export interface DashboardSummaryResponse {
  ordersToday: number;
  salesToday: number;
  reservationsToday: number;
  lowStock: InventoryResponse[];
  upcomingReservations: ReservationResponse[];
  recentReviews: ReviewResponse[];
  satisfaction: number;
  ordersWeek: Record<string, number>;
  salesWeek: Record<string, number>;
  reservationsWeek: Record<string, number>;
}
