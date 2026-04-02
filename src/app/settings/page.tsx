"use client";

import { ModeToggle } from "@/components/page-components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Code from "@/components/ui/code";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INginxSettings } from "@/helpers/proxy-manager/interfaces";
import nginxSettingsStore from "@/stores/nginx-settings";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir, homeDir } from "@tauri-apps/api/path";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

function SettingsPage() {
  const [appDataDirPath, setAppDataDirPath] = useState<string | null>(null);
  const [homeDirPath, setHomeDirPath] = useState<string | null>(null);
  const { settings, loaded, load, updateSettings, resetToDefaults } =
    nginxSettingsStore();
  const [localSettings, setLocalSettings] = useState<INginxSettings>(settings);

  useEffect(() => {
    appDataDir().then(setAppDataDirPath);
    homeDir().then(setHomeDirPath);
    load();
  }, []);

  useEffect(() => {
    if (loaded) {
      setLocalSettings(settings);
    }
  }, [loaded, settings]);

  const onOpenFinder = useCallback(async () => {
    invoke("open_finder_or_explorer", {
      path: appDataDirPath,
    });
  }, [appDataDirPath]);

  const onOpenBackupFiles = useCallback(async () => {
    invoke("open_finder_or_explorer", {
      path: `${homeDirPath}/ophiuchi.hosts.bak`,
    });
  }, [homeDirPath]);

  // if(!appDataDirPath) {
  //   return null;
  // }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex h-6 items-center">Settings</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated Files</CardTitle>
            <CardDescription className="space-y-2">
              <div>
                Required files to run nginx proxy localhost servers, such as
                self-signed certificates, nginx configuration files and
                docker-compose.yml files can be found at:
              </div>
              <div className="">
                <Code type="block" className="text-xs">
                  {appDataDirPath}
                </Code>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex">
            <p
              className="cursor-pointer text-xs underline"
              onClick={() => {
                onOpenFinder();
              }}
            >
              Show in Finder....
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Backup Files</CardTitle>
            <CardDescription className="space-y-2">
              <div>
                Whenever Ophiuchi makes changes to the /etc/hosts file, a backup
                is created at:
              </div>
              <div className="">
                <Code
                  type="block"
                  className="text-xs"
                >{`${homeDirPath}/ophiuchi.hosts.bak`}</Code>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex">
            <p
              className="cursor-pointer text-xs underline"
              onClick={() => {
                onOpenBackupFiles();
              }}
            >
              Show in Finder....
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dark/Light Mode</CardTitle>
            <CardDescription>
              Toggle between dark and light mode, or auto-detect system theme.
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="">
              <ModeToggle />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Nginx Buffer Settings</CardTitle>
            <CardDescription>
              Adjust buffer sizes for the nginx reverse proxy. Increase these
              values if you experience 502 errors with large headers or cookies
              (e.g. OAuth). Restart the container after saving to apply changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proxyBufferSize">Proxy Buffer Size</Label>
                <Input
                  id="proxyBufferSize"
                  value={localSettings.proxyBufferSize}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      proxyBufferSize: e.target.value,
                    })
                  }
                  placeholder="2k"
                />
                <p className="text-xs text-muted-foreground">
                  Size of the buffer for reading the first part of the response.
                  (e.g. 2k, 8k, 16k)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proxyBuffers">Proxy Buffers</Label>
                <Input
                  id="proxyBuffers"
                  value={localSettings.proxyBuffers}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      proxyBuffers: e.target.value,
                    })
                  }
                  placeholder="16 4k"
                />
                <p className="text-xs text-muted-foreground">
                  Number and size of buffers for proxied responses. (e.g. 16 4k,
                  8 8k)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="largeClientHeaderBuffers">
                  Large Client Header Buffers
                </Label>
                <Input
                  id="largeClientHeaderBuffers"
                  value={localSettings.largeClientHeaderBuffers}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      largeClientHeaderBuffers: e.target.value,
                    })
                  }
                  placeholder="4 8k"
                />
                <p className="text-xs text-muted-foreground">
                  Number and size of buffers for large client headers. (e.g. 4
                  8k, 4 16k, 4 32k)
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => updateSettings(localSettings)}
                disabled={
                  JSON.stringify(localSettings) === JSON.stringify(settings)
                }
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => resetToDefaults()}
              >
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

export default dynamic(() => Promise.resolve(SettingsPage), {
  ssr: false,
});
