<script setup lang="ts">
import { computed, ref, watch } from 'vue';
// import { useBoolean } from '@sa/hooks';
import { usePost, usePut } from '@awal/axios';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';
// import { enableStatusOptions } from '@/constants/business';
// import MenuAuthModal from './menu-auth-modal.vue';
// import ButtonAuthModal from './button-auth-modal.vue';

defineOptions({ name: 'MenuOperateDrawer' });

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
// const { bool: menuAuthVisible, setTrue: openMenuAuthModal } = useBoolean();
// const { bool: buttonAuthVisible, setTrue: openButtonAuthModal } = useBoolean();

const title = computed(() => {
  const titles: Record<UI.TableOperateType, string> = {
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole')
  };
  return titles[props.operateType];
});

type Model = { id?: number; name: string; status?: string | undefined };

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    id: 0,
    name: '',
    // roleCode: '',
    // roleDesc: '',
    status: undefined
  };
}

type RuleKey = Exclude<keyof Model, 'status' | 'id'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule
};

// const roleId = computed(() => props.rowData?.id || -1);

// const isEdit = computed(() => props.operateType === 'edit');

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
  // request
  if (props.operateType === 'edit') {
    await usePut(`/menus/${model.value.id}`, model.value);
    window.$notification?.success({
      title: $t('common.update'),
      message: $t('common.updateSuccess'),
      duration: 4500
    });
  } else {
    await usePost(`/menus`, model.value);
    window.$notification?.success({
      title: $t('common.add'),
      message: $t('common.addSuccess'),
      duration: 4500
    });
  }

  // window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="title" :size="360">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.manage.menu.name')" prop="name">
        <ElInput v-model="model.name" :placeholder="$t('page.manage.menu.form.name')" />
      </ElFormItem>
      <ElFormItem :label="$t('common.status')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio
            v-for="{ label, value } in [
              { label: 'common.disable', value: 0 },
              { label: 'common.enable', value: 1 }
            ]"
            :key="value"
            :value="value"
            :label="$t(label)"
          />
        </ElRadioGroup>
      </ElFormItem>
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
