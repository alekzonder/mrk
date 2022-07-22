import DevsConfig from "@0devs/config";

export type ConfigObject = {
    wwwDir: string;
};

export type ConfiClassType = typeof DevsConfig<ConfigObject>;

export type ConfigType = DevsConfig<ConfigObject>;

export const Config: ConfiClassType = DevsConfig;
