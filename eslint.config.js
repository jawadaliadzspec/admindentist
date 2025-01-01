import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig(
  { vue: true, unocss: true },
  // { extends: ['prettier'] },
  {
    rules: {
      // 'vue/multi-word-component-names': [
      //   'warn',
      //   {
      //     ignores: ['index', 'App', 'Register', '[id]', '[url]']
      //   }
      // ],
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: ['/^icon-/']
        }
      ],
      'unocss/order-attributify': 'off'
    }
  }
);
