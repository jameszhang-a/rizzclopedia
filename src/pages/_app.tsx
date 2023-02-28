import { type AppType } from "next/app";

import { api } from "~/utils/api";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <NotificationsProvider
        limit={3}
        position="top-right"
        containerWidth={300}
      >
        <Component {...pageProps} />
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
