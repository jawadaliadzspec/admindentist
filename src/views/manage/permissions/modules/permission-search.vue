<script lang="ts" setup>
import { ref } from 'vue';
import { $t } from '@/locales';
// import { enableStatusOptions } from '@/constants/business';
// import { translateOptions } from '@/utils/common';
defineOptions({ name: 'PermissionSearch' });

const activeName = ref(['permission-search']);

interface Emits {
  (e: 'reset'): void;

  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<any>('model', { required: true });

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}
</script>

<template>
  <ElCard class="card-wrapper">
    <ElCollapse v-model="activeName">
      <ElCollapseItem :title="$t('common.search')" name="permission-search">
        <ElForm :label-width="80" :model="model" label-position="right">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.permission.name')" prop="name">
                <ElInput v-model="model.name" :placeholder="$t('page.manage.permission.name')" />
              </ElFormItem>
            </ElCol>
            <!--            <ElCol :lg="6" :md="8" :sm="12">-->
            <!--              <ElFormItem :label="$t('page.manage.role.roleCode')" prop="roleCode">-->
            <!--                <ElInput v-model="model.roleCode" :placeholder="$t('page.manage.role.form.roleCode')" />-->
            <!--              </ElFormItem>-->
            <!--            </ElCol>-->
            <!--            <ElCol :lg="6" :md="8" :sm="12">-->
            <!--              <ElFormItem :label="$t('page.manage.role.roleStatus')" prop="status">-->
            <!--                <ElSelect v-model="model.status" :placeholder="$t('page.manage.role.form.roleStatus')" clearable>-->
            <!--                  <ElOption-->
            <!--                    v-for="{ label, value } in translateOptions(enableStatusOptions)"-->
            <!--                    :key="value"-->
            <!--                    :label="label"-->
            <!--                    :value="value"-->
            <!--                  ></ElOption>-->
            <!--                </ElSelect>-->
            <!--              </ElFormItem>-->
            <!--            </ElCol>-->
            <ElCol :lg="6" :md="24" :sm="24">
              <ElSpace alignment="end" class="w-full justify-end">
                <ElButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </ElButton>
                <ElButton plain type="primary" @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </ElButton>
              </ElSpace>
            </ElCol>
          </ElRow>
        </ElForm>
      </ElCollapseItem>
    </ElCollapse>
  </ElCard>
</template>

<style scoped></style>
