import axios from "axios";


//dashboard API s
export const categoryData = [
    {
      id: "1",
      name: "others",
    },
    {
      id: "2",
      name: "production",
    },
    {
      id: "3",
      name: "hse",
    },
    {
      id: "4",
      name: "labor relations",
    },
    {
      id: "5",
      name: "hr management",
    },
  ];
  
  export async function getGrievancesStatusSummary(
    startDate: string,
    endDate: string,
    businessUnit: string,
    category: string
  ) {
    const res = await axios.get(
      `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/status-summary`
    );
    return res.data;
  }
  
  export async function getGrievancesMonthlyStatusSummary(
    startDate: string,
    endDate: string,
    businessUnit: string,
    category: string
  ) {
    const res = await axios.get(
      `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/monthly-type-summary`
    );
    return res.data;
  }
  
  export async function getTypeOfGrievancesSummary(
    startDate: string,
    endDate: string,
    businessUnit: string,
    category: string
  ) {
    const res = await axios.get(
      `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/type-of-grievance`
    );
    return res.data;
  }
  
  export async function getCategoryOfGrievancesSummary(
    startDate: string,
    endDate: string,
    businessUnit: string
  ) {
    const res = await axios.get(
      `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/category-summary`
    );
    return res.data;
  }
  
  export async function getCategoryDepartment(
    startDate: string,
    endDate: string,
    businessUnit: string,
    category: string
  ) {
    const res = await axios.get(
      `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/department-summary`
    );
    return res.data;
  }
  
  export async function getCategoryTopic(
    startDate: string,
    endDate: string,
    businessUnit: string,
    category: string
  ) {
    const res = await axios.get(
      `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/topic-summary`
    );
    return res.data;
  }
  
  export async function getChannelSummery(
    startDate: string,
    endDate: string,
    businessUnit: string,
    category: string
  ) {
    const res = await axios.get(
      `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/channel-summary`
    );
    return res.data;
  }
  
  export async function getStarsSummery(
    startDate: string,
    endDate: string,
    businessUnit: string,
    category: string
  ) {
    const res = await axios.get(
      `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/stars-summary`
    );
    return res.data;
  }
  
  export async function getAnonymousSummery(
    startDate: string,
    endDate: string,
    businessUnit: string,
    category: string
  ) {
    const res = await axios.get(
      `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/anonymous-summary`
    );
    return res.data;
  }
  
  export async function getSeverityScoreSummery(
    startDate: string,
    endDate: string,
    businessUnit: string,
    category: string
  ) {
    const res = await axios.get(
      `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/severity-score-summary`
    );
    return res.data;
  }
  
  export async function getAllGrievanceSummery(year: number) {
    const res = await axios.get(`/api/grievance-dashboard/${year}/all-summary`);
    return res.data;
  }