import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const RecentIncome = ({data, onSeeMore}) => {
  return (
    <div className='card'>
        <div className="flex items-center justify-between ">
          <h5 className='text-lg' >Income</h5>

          <button className='card-btn' onClick={onSeeMore} >See all <LuArrowRight className='text-base' /> </button>
        </div>

        <div className="mt-6">
          {data?.slice(0, 5).map((transaction) => (
            <TransactionInfoCard
              key={transaction._id}
              title={transaction.source}
              icon={transaction.icon}
              date={moment(transaction.date).format('DD MMM YYYY')}
              amount={transaction.amount}
              type="income"
              hideDeleteBtn

            >

            </TransactionInfoCard>
          ))}
        </div>
    </div>
  )
}

export default RecentIncome