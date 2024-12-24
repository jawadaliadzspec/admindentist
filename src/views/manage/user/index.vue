<script setup lang="tsx">
import { ElButton, ElPopconfirm } from 'element-plus';
import { useDelete } from '@awal/axios';
import { fetchGetUserList } from '@/api/user';
import { $t } from '@/locales';
// import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { useTable, useTableOperate } from '@/hooks/common/table';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';

defineOptions({ name: 'UserManage' });

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchGetUserList,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 10,
    status: undefined,
    name: undefined,
    email: undefined,
    phone_number: undefined
  },
  columns: () => [
    { type: 'selection', width: 48 },
    { prop: 'index', label: $t('common.index'), width: 64 },
    { prop: 'name', label: $t('page.manage.user.name'), minWidth: 100 },
    { prop: 'email', label: $t('page.manage.user.email'), minWidth: 100 },
    { prop: 'phone_number', label: $t('page.manage.user.phone_number'), minWidth: 100 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      formatter: (row: any) => {
        return (
          <div class="flex-center">
            <ElButton type="primary" plain size="small" onClick={() => edit(row.id)}>
              {$t('common.edit')}
            </ElButton>
            <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
              {{
                reference: () => (
                  <ElButton type="danger" plain size="small">
                    {$t('common.delete')}
                  </ElButton>
                )
              }}
            </ElPopconfirm>
          </div>
        );
      }
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  for (const item of checkedRowKeys.value) {
    // eslint-disable-next-line no-await-in-loop
    await useDelete(`/users/${item.id}`, {});
  }
  await onBatchDeleted();
}

async function handleDelete(id: number) {
  // request
  await useDelete(`/users/${id}`, {});

  await onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="sm:flex-1-hidden card-wrapper" body-class="ht50">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.user.name') }}</p>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @refresh="getData"
          />
        </div>
      </template>
      <div class="h-[calc(100%-50px)]">
        <ElTable
          v-loading="loading"
          height="100%"
          border
          class="sm:h-full"
          :data="data"
          row-key="id"
          @selection-change="checkedRowKeys = $event"
        >
          <ElTableColumn v-for="col in columns" :key="col.prop" v-bind="col" />
        </ElTable>
      </div>
      <div class="mt-20px flex justify-end">
        <ElPagination
          v-if="mobilePagination.total"
          layout="total,prev,pager,next,sizes"
          v-bind="mobilePagination"
          @current-change="mobilePagination['current-change']"
          @size-change="mobilePagination['size-change']"
        />
      </div>
      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  .ht50 {
    height: calc(100% - 50px);
  }
}
</style>
