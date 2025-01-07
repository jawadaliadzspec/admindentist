import type { ObjectDirective } from 'vue';
import { usePermission } from '@/hooks/permission/usePermission';

export const permission: ObjectDirective = {
  mounted(el, binding) {
    const requiredPermissions = Array.isArray(binding.value) ? binding.value : [binding.value];

    if (!requiredPermissions.length) {
      console.warn('Permission directive requires at least one value.');
      return;
    }

    const { hasPermission } = usePermission();

    // Check if the user has at least one required permission
    const hasAnyPermission = requiredPermissions.some(perm => hasPermission(perm));

    if (!hasAnyPermission) {
      el.parentNode?.removeChild(el); // Safely remove the element
    }
  }
};
