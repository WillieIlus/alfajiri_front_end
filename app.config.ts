export default defineAppConfig({
  ui: {
    primary: 'torea-bay',
    gray: 'gallery',
    button: {
      rounded: 'rounded',
    },
    horizontalNavigation: {
      base: 'gap-2 px-3.5 py-4.5',
      active: 'text-white after:bg-primary-400',
      inactive: 'text-gray-200 hover:text-white',
    },
    input: {
      rounded: 'rounded',
    },
    card: {
      rounded: 'rounded',
      ring: 'ring-0 ring-gray-200 dark:ring-gray-800',
      shadow: 'shadow-lg',
      body: {
        padding: 'px-8 py-10 sm:p-6',
      },
    },
    dropdown: {
      rounded: 'rounded',
    },
    tabs: {
      rounded: 'rounded',
    },
    modal: {
      rounded: 'rounded',
    },
    tooltip: {
      rounded: 'rounded',
    },
    radio: {
      container: 'h-8',
      label: 'text-xl font-normal',
    },
    pagination: {
      rounded: 'rounded-full',
      base: 'my-3',
    },
  },
})
