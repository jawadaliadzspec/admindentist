<script setup lang="tsx">
import { ElButton, ElPopconfirm, ElTag } from 'element-plus';
// import { useDelete, useGet, usePut } from '@awal/axios';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { usePut } from '~/packages/axios/src/use-put';
import { useGet } from '~/packages/axios/src/use-get';
import { useDelete } from '~/packages/axios/src/use-delete';
import { fetchGetRoleList } from '@/api/manage';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
// import { enableStatusRecord } from '@/constants/business';
import RoleOperateDrawer from './modules/role-operate-drawer.vue';
import RoleSearch from './modules/role-search.vue';

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
  apiFn: fetchGetRoleList,
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
    { prop: 'name', label: $t('page.manage.role.name'), minWidth: 120 },
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
      // width: 200,
      formatter: (row: any) => (
        <div class="flex-center">
          <ElButton v-permission="role update" type="primary" plain size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </ElButton>
          <ElButton
            v-permission="role assign permission"
            type="primary"
            plain
            size="small"
            onClick={() => getAssignPermission(row.id)}
          >
            {$t('common.assignPermission')}
          </ElButton>
          <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton v-permission="role delete" type="danger" plain size="small">
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
const dialogFormVisible = ref(false);
// const formLabelWidth = '140px';
const selectedPermissions: Ref = ref([]);
const allPermissions: Ref = ref([]);
const roleId: Ref = ref(null);

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
    await useDelete(`/roles/${item.id}`, {});
  }

  await onBatchDeleted();
}

async function handleDelete(id: number) {
  // request
  await useDelete(`/roles/${id}`, {});

  await onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
async function getAssignPermission(id: number) {
  roleId.value = id;
  allPermissions.value = await useGet(`/menus`, {});
  const role: any = await useGet(`/roles/${id}`, {});
  selectedPermissions.value = role.data.permissions.map((item: any) => {
    return item.id;
  });
  dialogFormVisible.value = true;
}
async function updateAssignPermission() {
  const response: any = await usePut(`/roles/assign-permission/${roleId.value}`, {
    permissions: selectedPermissions.value
  });
  if (response.code === 200) {
    window.$notification?.success({
      title: $t('common.update'),
      message: $t('common.updateSuccess'),
      duration: 4500
    });
    dialogFormVisible.value = false;
    await getData();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard :header="$t('page.manage.role.title')" class="sm:flex-1-hidden card-wrapper" body-class="ht50">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.role.title') }}</p>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            create-permission="role create"
            delete-permission="role delete"
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
      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </ElCard>
    <ElDialog v-model="dialogFormVisible" title="Role permissions" width="70%">
      <ElTabs type="border-card" class="demo-tabs">
        <ElTabPane v-for="item in allPermissions.data" :key="item.id" :label="item.name">
          <ElCheckboxGroup v-model="selectedPermissions">
            <ElRow :gutter="20">
              <ElCol v-for="permission in item.permissions" :key="permission.id" :span="6">
                <ElCheckbox :label="permission.name" :value="permission.id" />
              </ElCol>
            </ElRow>
          </ElCheckboxGroup>
        </ElTabPane>
      </ElTabs>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="dialogFormVisible = false">Cancel</ElButton>
          <ElButton type="primary" @click="updateAssignPermission">Confirm</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  .ht50 {
    height: calc(100% - 50px);
  }
}
</style>
