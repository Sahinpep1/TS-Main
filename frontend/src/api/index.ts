/**
 * API barrel — re-exports all API functions from a single entry point.
 */

export { fetchCoordinates, fetchCoordinatesByStatus, fetchCoordinateById, get_sale_rep_list, get_ambalaj } from "./coordinatesApi";
export { fetchTrucks, fetchTruckCapacities, fetchTruckById } from "./trucksApi";
export {
  assignDelivery,
  unassignDelivery,
  autoAssign,
  resetAll,
  fetchSummary,
} from "./assignmentsApi";
