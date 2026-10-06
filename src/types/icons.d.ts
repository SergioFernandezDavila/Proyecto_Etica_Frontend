declare module '~icons/*' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, never>
  >;
  export default component;
}
