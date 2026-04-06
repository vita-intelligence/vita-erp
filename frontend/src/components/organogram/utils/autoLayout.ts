import { AUTO_LAYOUT_SPACING } from "../constants";
import type { OrganogramLayout, RoleSummary } from "../types";

/**
 * Auto-arranges roles in a top-down tree layout using BFS from the Owner.
 * Used when no saved positions exist for some or all roles.
 *
 * Returns a nodes_layout map (role UUID → {x, y}).
 */
export function autoLayout(
  roles: RoleSummary[],
  existingLayout: OrganogramLayout["nodes_layout"],
  edges: OrganogramLayout["edges"],
): Record<string, { x: number; y: number }> {
  const result: Record<string, { x: number; y: number }> = {
    ...existingLayout,
  };

  // Roles that need positioning
  const unpositioned = roles.filter((r) => !result[r.id]);
  if (unpositioned.length === 0) return result;

  // Build adjacency from edges (source → children)
  const children = new Map<string, string[]>();
  for (const edge of edges) {
    const list = children.get(edge.source) ?? [];
    list.push(edge.target);
    children.set(edge.source, list);
  }

  // Find root (system/owner role, or first role)
  const root = roles.find((r) => r.is_system) ?? roles[0];
  if (!root) return result;

  // BFS to assign levels
  const visited = new Set<string>();
  const levels = new Map<number, string[]>();
  const queue: { id: string; level: number }[] = [{ id: root.id, level: 0 }];
  visited.add(root.id);

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;
    const { id, level } = item;
    const levelList = levels.get(level) ?? [];
    levelList.push(id);
    levels.set(level, levelList);

    for (const childId of children.get(id) ?? []) {
      if (!visited.has(childId)) {
        visited.add(childId);
        queue.push({ id: childId, level: level + 1 });
      }
    }
  }

  // Place unvisited roles (disconnected) in an extra level
  const disconnected = roles.filter((r) => !visited.has(r.id));
  if (disconnected.length > 0) {
    const maxLevel = Math.max(...levels.keys(), -1) + 1;
    levels.set(
      maxLevel,
      disconnected.map((r) => r.id),
    );
  }

  // Assign positions per level
  for (const [level, ids] of levels) {
    const totalWidth = (ids.length - 1) * AUTO_LAYOUT_SPACING.x;
    const startX = -totalWidth / 2;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (!result[id]) {
        result[id] = {
          x: startX + i * AUTO_LAYOUT_SPACING.x,
          y: level * AUTO_LAYOUT_SPACING.y,
        };
      }
    }
  }

  return result;
}
