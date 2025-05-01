import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosinstance';
import toast from 'react-hot-toast';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';
import ExpenseOverview from './../../components/Expense/ExpenseOverview';
import Model from '../../components/Model';

const Expense = () => {
  useUserAuth();
  
   const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show : false,
      data:null
    });
      const [openAddExpenseModal, setOpenAddExpenseModal] =useState(false);

  //get All Expense Details
    const fetchExpenseDetails = async () => {
      if (loading) return;
      setLoading(true);
  
      try {
        const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
        if (response.data) {
          setExpenseData(response.data.expense);
          console.log("expenseData => ",response.data);
          
        }
      } catch (error) {
        console.error("Something went wrong: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Handle Add Income
    const handleAddExpense = async (data) => {
      const { category, amount, date, icon } = data;
      console.log("data===>", data);
      
      // validate checks
      if(!category.trim()){
        toast.error("Category is required !");
        return;
      }
  
      if (!amount || isNaN(amount) || !Number(amount)) {
        toast.error("Amount should be a valid number grater than 0.");
        return;
      }
  
      if (!date) {
        toast.error("Date is required !");
        return
      }
  
      try {
        await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE,{
          category,
          amount,
          date,
          icon
        });
  
        setOpenAddExpenseModal(false);
        toast.success("Expense added successfully !");
        fetchExpenseDetails();
      } catch (error) {
        console.error("Error while adding expense ", error.response?.data?.message || error.message      
        );
      }
    };

    const DeleteExpense= async (id) => {
      // alert(id);
      try {
        const response= await axiosInstance.get(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
        console.log("response => ", response.data);
        

        setOpenDeleteAlert({
          show: false, data: null
        });
        toast.success("Expense deleted successfully !");
        fetchExpenseDetails();
  
      } catch (error) {
          console.error("Error deleting Expense: ", error.response.message);
          
      }
    };
  
    // Handle download Expense Details
    const handleDownloadExpenseDetails= async () =>{
      try {
        const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
          responseType: 'blob',
        });

        // Create a URL for the blob data
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'expense_details.xlsx'); // Specify the file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        link.parentNode.removeChild(link); // Clean up the DOM
        window.URL.revokeObjectURL(url); // Release the blob URL
      } catch (error) {
        console.error("Error downloading expense details: ", error);
        toast.error("Failed to download expense details. Please try again.");
        
      }
    }

    useEffect(() => {
      fetchExpenseDetails();
      return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    
  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 m-auto">
          <div className="grid grid-cols-1 gap-6">
            <div className="">
              <ExpenseOverview 
                transactions={expenseData}
                onExpenseIncome={()=>setOpenAddExpenseModal(true)}
              />
            </div>
            <ExpenseList
              transactions={expenseData}
              onDelete={(id)=>{
                setOpenDeleteAlert({
                  show: true,
                  data: id
                })
              }}
              onDownload={handleDownloadExpenseDetails}
            />

          </div>
          <Model
            isOpen={openAddExpenseModal}
            onClose={()=>setOpenAddExpenseModal(false)}
            title="Add Expense"
          >
            <AddExpenseForm onAddExpense={handleAddExpense} />
          </Model>

          <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
            >
            <DeleteAlert
              content="Are you sure you want to delete this Expense ?"
              onDelete={()=>DeleteExpense(openDeleteAlert.data)}
            />
            </Model>
      </div>
      </DashboardLayout>
  )
}

export default Expense