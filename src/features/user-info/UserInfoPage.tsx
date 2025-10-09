"use client";

import BalanceList from "@/components/display/balances/BalanceList";
import UserInfoDisplayCard from "@/components/display/user-info/UserInfoDisplayCard";
import { useSdk } from "@/hooks/useSdk";
import { Balance } from "@quadcode-tech/client-sdk-js";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ChangePasswordLinkCard from "./ChangePasswordLinkCard";
import { IQ_OPTION } from "@/constants/app";
import Image from "next/image";
import IQOptionLogo from "@/assets/iqoption-logo.svg";
import { Text } from "@mantine/core";
import BalanceLinkCard from "./BalanceLinkCard";
import { useUserStore } from "@/stores/userStore";

export default function UserInfoPage() {
  const { sdk } = useSdk();
  const { firstName, lastName, userId } = sdk?.userProfile;
  const { user } = useUserStore();
  const [balances, setBalances] = useState<Balance[]>([]);
  const t = useTranslations();

  useEffect(() => {
    sdk?.balances().then((balances) => {
      setBalances(balances.getBalances());
    });
  }, [sdk]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-3">
        <div className="flex justify-center mb-0 w-full">
          <Image
            src={IQOptionLogo}
            alt={IQ_OPTION.name}
            width={200}
            height={24}
          />
        </div>

        <Text size="md" ta="center">
          {t("User information and balance are managed in IQ Option")}
        </Text>
      </div>

      <fieldset className="border border-blue-200 dark:border-blue-700 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <legend className="px-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
          {t("Account Information")}
        </legend>
        <div className="space-y-4 -mt-2">
          <UserInfoDisplayCard
            firstName={firstName}
            lastName={lastName}
            userId={userId}
            user={user}
          />
          <ChangePasswordLinkCard />
        </div>
      </fieldset>

      <fieldset className="mt-4 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <legend className="px-4 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
          {t("Balance Management")}
        </legend>
        <div className="space-y-4 -mt-2">
          <BalanceList balances={balances} />
          <BalanceLinkCard />
        </div>
      </fieldset>
    </div>
  );
}
