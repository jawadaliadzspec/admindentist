<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { usePut } from '@awal/axios';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'UserOperateDrawer' });

interface Props {
  /** the type of operation */
  operateType: UI.TableOperateType;
  /** the edit row data */
  rowData?: any | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<UI.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

type Model = Pick<'name' | 'email' | 'phone_number' | 'userRoles' | 'status', any>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    email: '',
    phone_number: ''
    // userRoles: [],
    // status: undefined
  };
}

type RuleKey = Extract<keyof Model, 'name' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  status: defaultRequiredRule
};

/** the enabled role options */
// const roleOptions = ref<CommonType.Option<string>[]>([]);

// async function getRoleOptions() {
//   const { error, data } = await fetchGetAllRoles();

//   if (!error) {
//     const options = data.map((item) => ({
//       label: item.roleName,
//       value: item.roleCode
//     }));

//     // the mock data does not have the roleCode, so fill it
//     // if the real request, remove the following code
//     const userRoleOptions = model.value.userRoles.map((item) => ({
//       label: item,
//       value: item
//     }));
//     // end

//     roleOptions.value = [...userRoleOptions, ...options];
//   }
// }

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  await usePut(`/users/${model.value.id}`, model.value);
  window.$notification?.success({
    title: $t('common.update'),
    message: $t('common.updateSuccess'),
    duration: 4500
  });
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    // getRoleOptions();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :size="360" :title="title">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.manage.user.name')" prop="name">
        <ElInput v-model="model.name" :placeholder="$t('page.manage.user.form.name')" />
      </ElFormItem>

      <ElFormItem :label="$t('page.manage.user.email')" prop="email">
        <ElInput v-model="model.email" :placeholder="$t('page.manage.user.form.email')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.user.phone_number')" prop="phone_number">
        <ElInput v-model="model.phone_number" :placeholder="$t('page.manage.user.form.phone_number')" />
      </ElFormItem>
      <!--
 <ElFormItem :label="$t('page.manage.user.userStatus')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio
            v-for="item in enableStatusOptions"
            :key="item.value"
            :value="item.value"
            :label="$t(item.label)"
          />
        </ElRadioGroup>
      </ElFormItem> 
-->
      <!--
 <ElFormItem :label="$t('page.manage.user.userRole')" prop="roles">
        <ElSelect
          v-model="model.userRoles"
          multiple
          :placeholder="$t('page.manage.user.form.userRole')"
        >
          <ElOption
            v-for="{ label, value } in roleOptions"
            :key="value"
            :label="label"
            :value="value"
          />
        </ElSelect>
      </ElFormItem> 
-->
    </ElForm>
    <template #footer>
      <ElSpace :size="16">
        <ElButton @click="closeDrawer">{{ $t('common.cancel') }}</ElButton>
        <ElButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</ElButton>
      </ElSpace>
    </template>
  </ElDrawer>
</template>

<style scoped></style>
