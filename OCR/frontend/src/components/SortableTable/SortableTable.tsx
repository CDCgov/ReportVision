import {FC, useState} from 'react';
import {Icon, Table} from "@trussworks/react-uswds";
import SortArrow from './sort-direction-arrow.svg'
import SortableIcon from './sortable-icon.svg'
import './SortableTable.scss'

interface SortableTableProps {
    data: Array<Map<string, any>>,
    sortableBy: Array<string> | undefined,
    defaultSort: string | undefined,
    defaultDescending: boolean | undefined,
    columns: Array<string> | undefined,
    columnNames: Map<string, string> | undefined,
    formatters: Map<string, (any) => any> | undefined
}

const SORTS = {
    '[object Object]': new Intl.Collator(navigator.language).compare,
    '[object String]': new Intl.Collator(navigator.language).compare,
    '[object Number]': (a, b) => a - b,
    '[object Date]': (a, b) => a?.getTime() - b?.getTime()
}

export const SortableTable: FC<SortableTableProps> = ({
                                                          data,
                                                          sortableBy,
                                                          defaultSort,
                                                          defaultDescending = false,
                                                          columns, formatters = {},
                                                          columnNames = {},
                                                      }: SortableTableProps) => {
    if (!columns) {
        columns = Object.keys(data[0])
    }
    const [sortBy, setSortBy] = useState(defaultSort || columns?.[0])
    const [isDescending, setIsDescending] = useState(defaultDescending)

    const updateSort = (column: string) => {
        if (column === sortBy) {
            setIsDescending(!isDescending)
        } else {
            setSortBy(column)
        }
    }

    const columnData = data?.[0]?.[sortBy]
    const columnType = Object.prototype.toString.call(columnData)
    const sortFunc = SORTS[columnType] || new Intl.Collator(navigator.language).compare
    const sortedData = data?.toSorted((a, b) => sortFunc(a[sortBy], b[sortBy])) || []

    if (isDescending) {
        sortedData.reverse()
    }


    return (
        <>
            <Table fullWidth striped>
                <thead>
                <tr>
                    {columns.map((c, idx) => {
                        return <SortableTableHeader key={String(idx)} sortBy={sortBy as string} column={c} name={columnNames?.[c] || c}
                                                    isDescending={isDescending || false} onClick={updateSort}/>
                    })}
                </tr>
                </thead>
                <tbody>
                {sortedData.map((t, idx) => {
                    return (<tr key={idx}>
                        {columns?.map((col, colIdx) => {
                            return <td
                                key={colIdx}>{formatters?.[col] ? formatters?.[col](t[col]) : t[col]?.toString()}</td>
                        })}
                    </tr>)
                })}
                </tbody>
            </Table>
        </>
    )
}

interface SortableTableHeaderProps {
    sortBy: string,
    name: string,
    column: string,
    isDescending: boolean,
    onClick: (string) => void,
    key: string
}

const SortableTableHeader: FC<SortableTableHeaderProps> = ({
                                                               sortBy,
                                                               name, column, isDescending,
                                                               onClick
                                                           }: SortableTableHeaderProps) => {

    const isSortedBy = sortBy === column
    return <>
        <th onClick={() => onClick(column)}>
            <div className="display-flex flex-row">
                <div>{name}</div>
                <div className="flex-1"></div>
            {isSortedBy ? <SortOrderIcon isDescending={isDescending}/> : <SortIcon/>}
            </div>
        </th>
    </>
}

interface SortIconProps {
    isDescending: boolean | undefined
}

const SortOrderIcon: FC<SortIconProps> = ({isDescending = false}) => {
    return <>
        <img className={`margin-left-1 height-2 ${isDescending ? '' : 'sort-arrow-up'}`} src={SortArrow}
             alt={`Sorting ${isDescending ? 'descending' : 'ascending'}`}/>
    </>
}

const SortIcon: FC = () => {
    return <>
        <img className={`margin-left-1 height-2 `} src={SortableIcon} alt="Sort by"/>
    </>
}