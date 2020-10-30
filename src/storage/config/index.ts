import localforage from "localforage";
import { merge } from "merge-anything";
import * as yup from "yup";
import { OptionalRecursive } from "../../interfaces/OptionalRecursive";

export const configSchema = yup
  .object()
  .shape({})
  .default(() => ({}));

export interface ConfigStore {}

export const getConfigStore = () =>
  localforage.createInstance({ name: "config" });

export const getConfig = async (): Promise<ConfigStore> => {
  return configSchema.cast(
    (await getConfigStore().getItem("config")) || {},
  ) as ConfigStore;
};

export function setConfig(
  config: OptionalRecursive<ConfigStore>,
  returnUpdatedConfig?: false,
): Promise<void>;

export function setConfig(
  config: OptionalRecursive<ConfigStore>,
  returnUpdatedConfig?: true,
): Promise<ConfigStore>;

export async function setConfig(
  config: OptionalRecursive<ConfigStore>,
  returnUpdatedConfig = false,
) {
  if (!configSchema.isValidSync(config)) {
    return Promise.reject();
  }
  await getConfigStore().setItem(
    "config",
    configSchema.cast(merge(await getConfig(), config)),
  );
  if (returnUpdatedConfig) {
    return Promise.resolve(await getConfig());
  }
  return Promise.resolve();
}
