import { Row, Typography } from "antd";
import { memo, useState, useEffect } from "react";

import config from "../config";
import { formatOrders } from "../utils";
import OverdueSalesTable from "./OverdueSalesTable";

const OverdueSales = ({ style }: any) => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({})
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const resp = await fetch(`${config.apiUrl}/sales`, {
          method: "GET",
        });
        const summaryResp = await fetch(`${config.apiUrl}/sales-summary`, {
          method: "GET",
        });

        const body = await resp.json();
        const summaryBody = await summaryResp.json();
        
        if (!body?.orders?.length) {
          return setIsLoading(false);
        }

        setOrders(formatOrders(body.orders));
        setSummary(summaryBody)
        setIsLoading(false);
      } catch (error) {
        console.error("--------query sales error", error);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <Row style={style}>
      <Typography.Paragraph strong>Overdue Orders</Typography.Paragraph>
      <OverdueSalesTable isLoading={isLoading} orders={orders} summary={summary}/>
    </Row>
  );
};

export default memo(OverdueSales);
