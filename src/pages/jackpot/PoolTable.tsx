import { Table, TableBody, TableCell, TableHead, TableRow } from '@tremor/react'
import { JackpotPoolData } from './api'

const PoolTable = ({ data: poolItem }: { data: JackpotPoolData }) => (
  <div className='w-full flex justify-center'>
    {poolItem.categoryNames.map((category, idx) => {
      const categoryData = category.toLowerCase() in poolItem.categories ? poolItem.categories[category.toLowerCase()] : {}
      const total = Object.keys(categoryData).reduce((s, x) => s + categoryData[x], 0)
      return (
        <Table key={idx} className='w-100 min-w-60 border-color border table-fixed'>
          <TableHead className='border-color border-b'>
            <TableRow>
              <TableCell colSpan={2} className='text-center font-semibold p-2'>
                <div>{category}</div>
                <div>CNY {total.toString()}</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(categoryData).map((categoryKey, dataIdx) => (
              <TableRow key={`${idx}-${dataIdx}`}>
                <TableCell className='text-right border-color border-r w-[50%]'>{categoryKey}</TableCell>
                <TableCell className='text-left'>{categoryData[categoryKey].toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    })}
  </div>
)

export default PoolTable