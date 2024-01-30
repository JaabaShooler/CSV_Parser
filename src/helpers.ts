import moment from "moment";
import { DataItem } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateData = (data: any[]): DataItem[] => {
  const validatedData: DataItem[] = [];

  data.forEach((row, index) => {
    // Validate and format each field according to rules
    const formattedRow: DataItem = {
      id: index + 1,
      fullName: row["Full Name"]?.trim(),
      phone: row["Phone"]?.trim()?.replace(/^\+?1?/, ""),
      email: row["Email"]?.trim()?.toLowerCase(),
      age: parseInt(row["Age"]),
      experience: parseInt(row["Experience"]),
      yearlyIncome: parseFloat(row["Yearly Income"]?.replace(/,/g, "")),
      hasChildren: row["Has children"] === "" ? "FALSE" : row["Has children"],
      licenseStates: row["License states"]
        ?.split("|")
        ?.map((state: string) => state?.trim()),
      expirationDate: moment(
        row["Expiration date"],
        ["YYYY-MM-DD", "MM/DD/YYYY"],
        true
      ).format("YYYY-MM-DD"),
      licenseNumber: row["License number"]?.trim(),
    };

    validatedData.push(formattedRow);
  });

  return validatedData;
};

export const TableColumns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Experience",
    dataIndex: "experience",
    key: "experience",
  },
  {
    title: "Yearly Income",
    dataIndex: "yearlyIncome",
    key: "yearlyIncome",
  },
  {
    title: "Has Children",
    dataIndex: "hasChildren",
    key: "hasChildren",
  },
  {
    title: "License States",
    dataIndex: "licenseStates",
    key: "licenseStates",
  },
  {
    title: "Expiration Date",
    dataIndex: "expirationDate",
    key: "expirationDate",
  },
  {
    title: "License Number",
    dataIndex: "licenseNumber",
    key: "licenseNumber",
  },
].map((column) => ({
  ...column,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCell: (record: any) => ({
    style: {
      backgroundColor: getBackgroundColor(
        column.dataIndex,
        record[column.dataIndex],
        record
      ),
    },
  }),
}));

export const getBackgroundColor = (
  columnIndex: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: any
) => {
  switch (columnIndex) {
    case "fullName":
      return value?.length === 0 ? "red" : "transparent";
    case "phone":
      return !(/^\+?[0-9]*$/.test(value) && value.length === 10)
        ? "red"
        : "transparent";
    case "email":
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "red" : "transparent";
    case "age":
      return isNaN(parseInt(value)) || parseInt(value) < 21
        ? "red"
        : "transparent";
    case "experience":
      return isNaN(parseInt(value)) ||
        parseInt(value) < 0 ||
        parseInt(value) > record.age
        ? "red"
        : "transparent";
    case "yearlyIncome":
      return isNaN(parseFloat(value)) ||
        parseFloat(value) < 0 ||
        parseFloat(value) > 1000000
        ? "red"
        : "transparent";
    case "hasChildren":
      return value == "TRUE" || value == "FALSE" ? "transparent" : "red";
    case "licenseStates":
      return value?.some((state: string) => !/^[A-Za-z\s]+$/.test(state))
        ? "red"
        : "transparent";
    case "expirationDate":
      return !moment(value, ["YYYY-MM-DD", "MM/DD/YYYY"], true).isValid() ||
        moment(value).isAfter(moment(), "day")
        ? "red"
        : "transparent";
    case "licenseNumber":
      return value?.trim().length !== 6 || !/^[A-Za-z0-9]+$/.test(value)
        ? "red"
        : "transparent";
    default:
      return "transparent";
  }
};
