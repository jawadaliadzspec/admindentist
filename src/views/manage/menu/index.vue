<script setup lang="tsx">
import { ElButton, ElPopconfirm, ElTag } from 'element-plus';
import { useDelete } from '@awal/axios';
import { fetchGetMenuList } from '@/api/manage';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
// import { enableStatusRecord } from '@/constants/business';
import MenuOperateDrawer from './modules/menu-operate-drawer.vue';
import MenuSearch from './modules/menu-search.vue';

const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchGetMenuList,
  apiParams: {
    current: 1,
    size: 10,
    status: undefined,
    name: undefined,
    created_by: undefined
  },
  columns: () => [
    { type: 'selection', width: 48 },
    { prop: 'index', label: $t('common.index'), width: 64 },
    { prop: 'name', label: $t('page.manage.menu.name'), minWidth: 120 },
    // { prop: 'roleCode', label: $t('page.manage.role.roleCode'), minWidth: 120 },
    // { prop: 'roleCodDesc', label: $t('page.manage.role.roleDesc'), minWidth: 120 },
    {
      prop: 'status',
      label: $t('common.status'),
      width: 100,
      formatter: (row: any) => {
        if (row.status === undefined) {
          return '';
        } else if (row.status === 1) {
          return <ElTag type="success">Active</ElTag>;
        }
        return <ElTag type="danger">Disable</ElTag>;
      }
    },
    { prop: 'created_by', label: $t('common.createdBy'), minWidth: 120 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      width: 130,
      formatter: (row: any) => (
        <div class="flex-center">
          <ElButton type="primary" v-permission="menu update" plain size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </ElButton>
          <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton v-permission="menu delete" type="danger" plain size="small">
                  {$t('common.delete')}
                </ElButton>
              )
            }}
          </ElPopconfirm>
        </div>
      )
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
  // requests
  for (const item of checkedRowKeys.value) {
    // eslint-disable-next-line no-await-in-loop
    await useDelete(`/menus/${item.id}`, {});
  }

  await onBatchDeleted();
}

async function handleDelete(id: number) {
  // request
  await useDelete(`/menus/${id}`, {});

  await onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <MenuSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard :header="$t('page.manage.menu.title')" class="sm:flex-1-hidden card-wrapper" body-class="ht50">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.menu.title') }}</p>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            create-permission="menu create"
            delete-permission="menu delete"
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
          :border="true"
          class="sm:h-full"
          :data="data"
          row-key="id"
          @selection-change="checkedRowKeys = $event"
        >
          <ElTableColumn v-for="col in columns" :key="col.prop" v-bind="col" />
        </ElTable>
        <div class="mt-20px flex justify-end">
          <ElPagination
            v-if="mobilePagination.total"
            layout="total,prev,pager,next,sizes"
            v-bind="mobilePagination"
            @current-change="mobilePagination['current-change']"
            @size-change="mobilePagination['size-change']"
          />
        </div>
      </div>
      <MenuOperateDrawer
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
