<script lang="ts" setup>
import { usePermission } from '@/hooks/permission/usePermission';
import { $t } from '@/locales';

defineOptions({ name: 'TableHeaderOperation' });

interface Props {
  // itemAlign?: UI.Align;
  disabledDelete?: boolean;
  loading?: boolean;
  createPermission?: any;
}

defineProps<Props>();

interface Emits {
  (e: 'add'): void;

  (e: 'delete'): void;

  (e: 'refresh'): void;
}

const emit = defineEmits<Emits>();
const { hasPermission } = usePermission();

const columns = defineModel<UI.TableColumnCheck[]>('columns', {
  default: () => []
});

function add() {
  emit('add');
}

function batchDelete() {
  emit('delete');
}

function refresh() {
  emit('refresh');
}
</script>

<template>
  <ElSpace class="lt-sm:w-200px" direction="horizontal" justify="end" wrap>
    <slot name="prefix"></slot>
    <slot name="default">
      <ElButton :disabled="!createPermission || !hasPermission([createPermission])" plain type="primary" @click="add">
        <template #icon>
          <icon-ic-round-plus class="text-icon" />
        </template>
        {{ $t('common.add') }}
      </ElButton>
      <ElPopconfirm :title="$t('common.confirmDelete')" @confirm="batchDelete">
        <template #reference>
          <ElButton :disabled="disabledDelete" plain type="danger">
            <template #icon>
              <icon-ic-round-delete class="text-icon" />
            </template>
            {{ $t('common.batchDelete') }}
          </ElButton>
        </template>
      </ElPopconfirm>
    </slot>
    <ElButton @click="refresh">
      <template #icon>
        <icon-mdi-refresh :class="{ 'animate-spin': loading }" class="text-icon" />
      </template>
      {{ $t('common.refresh') }}
    </ElButton>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </ElSpace>
</template>

<style scoped></style>
