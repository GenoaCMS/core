<script lang="ts">
    import Logout from '$lib/components/Logout.svelte'
    import NavbarItem from './NavbarItem.svelte'
    import { DarkMode } from 'flowbite-svelte'
    import { pages } from './pages'

</script>

<div class="sticky z-0 top-0 bottom-0 h-screen flex flex-col justify-center dark:bg-gray-800 p-5">
  <div class="my-auto">
    {#each pages as page}
      <NavbarItem {...page}/>
    {/each}
  </div>
  <div class="flex justify-between">
    <DarkMode/>
    <Logout/>
  </div>
</div>
