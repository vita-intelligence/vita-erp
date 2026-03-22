/**
 * Sample FAQ data for the accordion preview.
 */

export const FAQ_ITEMS = [
  {
    id: "production",
    title: "How do I create a production order?",
    content:
      'Navigate to Production > New Order, select the product from the catalog, specify quantity and due date, then click "Create." The order will appear in your production queue.',
  },
  {
    id: "inventory",
    title: "How is inventory tracked?",
    content:
      "Inventory updates automatically when production orders are completed or materials are consumed. You can view real-time stock levels in the Inventory dashboard and set low-stock alerts per item.",
  },
  {
    id: "export",
    title: "Can I export reports to Excel?",
    content:
      'Yes — every report page has an "Export" button in the top-right corner. You can export to CSV, XLSX, or PDF. Scheduled exports can be configured in Settings > Reports.',
  },
  {
    id: "roles",
    title: "How do I manage user roles?",
    content:
      "Go to Settings > Team > Roles. You can create custom roles with granular permissions for each module. Changes take effect immediately for all users assigned to that role.",
  },
];
