interface Config {
  accion: string;
}

export interface RequestBodyDeviceConfig {
  mac: string;
  config: Config;
}
