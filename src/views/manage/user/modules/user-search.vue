<script lang="ts" setup>
import { $t } from '@/locales';
import { useForm } from '@/hooks/common/form';
// import { enableStatusOptions } from '@/constants/business';
// import { translateOptions } from '@/utils/common';

defineOptions({ name: 'UserSearch' });

interface Emits {
  (e: 'reset'): void;

  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useForm();

const model: any = defineModel('model', { required: true });

// type RuleKey = Extract<keyof 'email' | 'phone_number', any>;

// const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
//   const { patternRules } = useFormRules(); // inside computed to make locale reactive
//
//   return {
//     email: patternRules.email,
//     phone_number: patternRules.phone
//   };
// });

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <ElCard class="card-wrapper">
    <ElCollapse>
      <ElCollapseItem :title="$t('common.search')" name="user-search">
        <ElForm ref="formRef" :label-width="80" :model="model" label-position="right">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.user.name')" prop="name">
                <ElInput v-model="model.name" :placeholder="$t('page.manage.user.form.name')" />
              </ElFormItem>
            </ElCol>
            <!--
 <ElCol :lg="6" :md="8" :sm="12" :label="$t('page.manage.user.userGender')">
              <ElFormItem :label="$t('page.manage.user.userGender')" prop="userGender">
                <ElSelect
                  v-model="model.userGender"
                  clearable
                  :placeholder="$t('page.manage.user.form.userGender')"
                >
                  <ElOption
                    v-for="(item, idx) in translateOptions(userGenderOptions)"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  ></ElOption>
                </ElSelect>
              </ElFormItem>
            </ElCol> 
-->
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.user.email')" prop="email">
                <ElInput v-model="model.email" :placeholder="$t('page.manage.user.form.email')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.user.phone_number')" prop="phone_number">
                <ElInput v-model="model.phone_number" :placeholder="$t('page.manage.user.form.phone_number')" />
              </ElFormItem>
            </ElCol>

            <!--
 <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.user.userStatus')" prop="userStatus">
                <ElSelect
                  v-model="model.userGender"
                  clearable
                  :placeholder="$t('page.manage.user.form.userStatus')"
                >
                  <ElOption
                    v-for="{ label, value } in translateOptions(enableStatusOptions)"
                    :key="value"
                    :label="label"
                    :value="value"
                  ></ElOption>
                </ElSelect>
              </ElFormItem>
            </ElCol> 
-->
            <ElCol :lg="12" :md="24" :sm="24">
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
