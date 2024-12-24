// import { rimraf } from 'rimraf';

// export async function cleanup(paths: string[]) {
//   await rimraf(paths, { glob: true });
// }

import { rimraf } from 'rimraf';

export async function cleanup(paths: string[]) {
  try {
    await Promise.all(
      paths.map(async path => {
        await rimraf(path, { glob: true });
        console.log(`Successfully deleted: ${path}`);
      })
    );
  } catch (error) {
    console.error(`Failed to delete some paths. Error:`, error);
  }
}
