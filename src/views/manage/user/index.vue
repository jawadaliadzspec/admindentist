<script lang="tsx" setup>
import { ElButton, ElPopconfirm } from 'element-plus';
// import { useDelete, useGet, usePut } from '@awal/axios';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { useGet } from '~/packages/axios/src/use-get';
import { useDelete } from '~/packages/axios/src/use-delete';
import { usePut } from '~/packages/axios/src/use-put';
import { fetchUserList } from '@/api/manage';
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
  apiFn: fetchUserList,
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
    { type: 'selection' },
    { prop: 'index', label: $t('common.index'), width: 50 },
    { prop: 'name', label: $t('page.manage.user.name') },
    { prop: 'email', label: $t('page.manage.user.email') },
    { prop: 'phone_number', label: $t('page.manage.user.phone_number') },
    {
      prop: 'roles',
      label: $t('common.role'),
      align: 'center',
      formatter: (row: any) => {
        return (
          <div class="flex-center gap-2">
            {row.roles.map((role: any) => (
              <el-tag type="primary">{role.name}</el-tag>
            ))}
          </div>
        );
      }
    },
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
            <ElButton type="primary" plain size="small" onClick={() => editRole(row)}>
              {$t('common.assignRole')}
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
const selectedRole: Ref = ref([]);
const allRoles: Ref = ref([]);
const dialogFormVisible = ref(false);
const userId = ref(null);

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

async function editRole(row: any) {
  userId.value = row.id;
  allRoles.value = await useGet(`/roles`, {});
  selectedRole.value = row.roles.map((item: any) => {
    return item.id;
  });
  dialogFormVisible.value = true;
}

async function updateRole() {
  const response: any = await usePut(`/users/assign-role/${userId.value}`, {
    roles: selectedRole.value
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
    <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard body-class="ht50" class="sm:flex-1-hidden card-wrapper">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.user.name') }}</p>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            create-permission="user create"
            delete-permission="user delete"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @refresh="getData"
          />
        </div>
      </template>
      <div class="h-[calc(100%-50px)]">
        <ElTable
          v-loading="loading"
          :data="data"
          border
          class="sm:h-full"
          height="100%"
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
    <ElDialog v-model="dialogFormVisible" title="Assign Role" width="500">
      <ElFormItem label="Roles">
        <ElSelect v-model="selectedRole" multiple placeholder="Please select a role">
          <ElOption v-for="role in allRoles.data" :key="role.id" :label="role.name" :value="role.id" />
        </ElSelect>
      </ElFormItem>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="dialogFormVisible = false">Cancel</ElButton>
          <ElButton type="primary" @click="updateRole">Confirm</ElButton>
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
