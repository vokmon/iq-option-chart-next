import { User } from "@/types/user";
import { useTranslations } from "next-intl";
import { useSubscriptionExpire } from "@/hooks/useSubscriptionExpire";

type SubscriptExpireProps = {
  user?: User;
};

export default function SubscriptExpire({ user }: SubscriptExpireProps) {
  const t = useTranslations();
  const expireState = useSubscriptionExpire(user);

  if (!expireState) return null;

  const { daysRemaining, expiredAt, statusColor, dotColor, statusKey } =
    expireState;

  const getStatusText = () => {
    if (statusKey === "expiringSoon") {
      if (daysRemaining > 1) {
        return t("Expires in days", { days: daysRemaining });
      } else if (daysRemaining === 1) {
        return t("Expires tomorrow");
      } else {
        return t("Expires today");
      }
    }
    return t(statusKey);
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusColor}`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="font-medium">{getStatusText()}</span>
        <span className="text-xs opacity-75 font-medium">
          {expiredAt.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
