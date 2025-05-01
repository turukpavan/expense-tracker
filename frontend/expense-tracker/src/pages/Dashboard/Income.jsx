import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import Model from '../../components/Model';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';
import EmojiPicker from 'emoji-picker-react';

const Income = () => {
    useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show : false,
    data:null
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] =useState(false);

  //get All Income Details
  const fetchIncomeDetails = async () => {

    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (response.data) {
        setIncomeData(response.data.income);
        // console.log("incomeData => ",response.data.income);
        
      }
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Income
  const handleAddIncome =async(data) => {
    console.log("data===>", data);
    
    const { source, amount, date, icon } = data;
    // validate checks
    if (!source.trim()) {
      toast.error("Source is required !");
      return;
    }

    if (!amount || isNaN(amount) || !Number(amount)) {
      toast.error("Amount should be a valid number and grater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required !");
      return
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully !");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error added successfully ");
      error.response?.data?.message || error.message      
    }
  };

  // Handle Delete Income
  const DeleteIncome= async (id) => {
    try {
      await axiosInstance.get(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income deleted successfully !");
      fetchIncomeDetails();

    } catch (error) {
        console.error("Error deleting income: ", error.response?.data);
        
    }
  };

  // Handle download Income Details
  const handleDownloadIncomeDetails= async () =>{
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: 'blob',
      });

      // Create a URL for the blob data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.xlsx'); // Specify the file name
      document.body.appendChild(link);
      link.click(); // Trigger the download
      link.parentNode.removeChild(link); // Clean up the DOM
      window.URL.revokeObjectURL(url); // Release the blob URL
    } catch (error) {
      console.error("Error downloading income details: ", error);
      toast.error("Failed to download income details. Please try again.");
      
    }
  }

  useEffect(() => {
    fetchIncomeDetails();
    return () => {}
  },[]);

  if (loading) {
    return <p>Loading...</p>; // Display a loading indicator while fetching data
}


  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Model
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Model>
        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
            >
            <DeleteAlert
              content="Are you sure you want to delete this income ?"
              onDelete={() => {
                DeleteIncome(openDeleteAlert.data);
              }}
            />
            </Model>
      </div>
      
      </DashboardLayout>
  )
}

export default Income