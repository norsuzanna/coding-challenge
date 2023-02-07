import { Table, Typography, Space } from "antd";
import { memo, useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { getFlagEmoji } from "../utils";

const { Text } = Typography;

const OverdueSalesTable = ({
  orders = [],
  isLoading = false,
  summary = {},
}: any) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  console.log(summary);

  const columns = useMemo(
    () => [
      {
        title: "MARKETPLACE",
        render: (record: any) => {
          const flag = getFlagEmoji(record.store.country.slice(0, 2));
          return (
            <div
              style={{
                fontWeight: "normal",
                display: "flex",
                flexDirection: "row",
              }}
            >
              {`${flag} ${record.store.marketplace}`}
            </div>
          );
        },
        responsive: ["md"],
      },
      {
        title: "STORE",
        render: (record: any) => record.store.shopName,
        responsive: ["md"],
      },
      {
        title: "ORDER ID",
        dataIndex: "orderId",
      },
      {
        title: "ITEMS",
        dataIndex: "items",
        align: "center",
      },
      {
        title: "DESTINATION",
        dataIndex: "destination",
        responsive: ["md"],
      },
      {
        title: "DAYS OVERDUE",
        dataIndex: "latest_ship_date",
        render: (record: any, item: any) => {
          return (
            <Text
              type={item.shipment_status === "Pending" ? "danger" : "success"}
              key={item.Id}
            >
              {(item.shipment_status === "Pending" ? "-" : "") +
                calculateDaysOverdue(record)}
            </Text>
          );
        },
      },
      {
        title: "ORDER VALUE",
        dataIndex: "orderValue",
        render: (record: any) => "$" + record,
      },
      {
        title: "ORDER TAXES",
        dataIndex: "taxes",
        render: (record: any) => record + "%",
      },
      {
        title: "ORDER TOTAL",
        dataIndex: "orderValue",
        render: (record: any, item: any) => {
          return (
            <Text key={item.Id}>{"$" + calculateOrderTotal(record, item)}</Text>
          );
        },
      },
    ],
    []
  );

  const onChange = useCallback((current: number, pageSize: number) => {
    setPagination({ current, pageSize });
  }, []);

  const showTotal = useCallback((total: any, range: any) => {
    return `${range[0]} - ${range[1]} of ${total}`;
  }, []);

  const paginationObj = useMemo(
    () => ({
      onChange,
      showTotal,
      pageSizeOptions: [5, 10],
      ...pagination,
    }),
    [onChange, pagination, showTotal]
  );

  const calculateDaysOverdue = (date: any) => {
    let dateDiffFormat = date.split("/").reverse().join("-");
    let shipDate = dayjs(dateDiffFormat);
    let today = dayjs(dayjs().format("YYYY-MM-DD"));
    let overdueDays = today.diff(shipDate, "days");

    return overdueDays;
  };

  const calculateOrderTotal = (orderValue: any, item: any) => {
    let totalItem = parseFloat(item.items) * parseFloat(orderValue);
    let orderTotal = (
      totalItem * (parseFloat(item.taxes) / 100) +
      totalItem
    ).toFixed(2);

    return orderTotal;
  };

  return (
    <>
      <Table
        size="small"
        // @ts-ignore
        columns={columns}
        loading={isLoading}
        dataSource={orders}
        pagination={paginationObj}
        s
      />
      <Space direction="vertical">
        <Text>All Order</Text>
        <Space className="first-summary">
          <Text>Sub Total</Text>
          <Text strong>${summary.subTotal}</Text>
        </Space>
        <Space>
          <Text>Tax Total</Text>
          <Text strong>${summary.taxTotal}</Text>
        </Space>
        <Space>
          <Text>Total</Text>
          <Text strong>${summary.total}</Text>
        </Space>
      </Space>
    </>
  );
};

export default memo(OverdueSalesTable);
