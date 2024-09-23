import {FC, useState} from 'react';
import {Table} from "@trussworks/react-uswds";
import SortArrow from './sort-direction-arrow.svg'
import SortableIcon from './sortable-icon.svg'
import './SortableTable.scss'

interface SortableTableProps {
    data: Array<Map<string, object>>,
    sortableBy: Array<string> | undefined,
    defaultSort: string | undefined,
    defaultDescending: boolean | undefined,
    columns: Array<string> | undefined,
    columnNames: Map<string, string> | undefined,
    formatters: Map<string, (any, number, any ) => object> | undefined
}

const SORTS = {
    '[object Object]': new Intl.Collator(navigator.language).compare,
    '[object String]': new Intl.Collator(navigator.language).compare,
    '[object Number]': (a, b) => a - b,
    '[object Date]': (a, b) => a?.getTime() - b?.getTime()
}

export const SortableTable: FC<SortableTableProps> = ({
                                                          data,
                                                          columns = Object.keys(data[0]),
                                                          sortableBy = columns,
                                                          defaultSort = columns?.[0],
                                                          defaultDescending = false,

                                                          formatters = {},
                                                          columnNames = {},
                                                      }: SortableTableProps) => {

    const [sortBy, setSortBy] = useState(defaultSort)
    const [isDescending, setIsDescending] = useState(defaultDescending)
    const sortableSet = new Set(sortableBy || [])
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
            <Table fullWidth striped>
                <thead>
                <tr>
                    {columns.map((c, idx) => {
                        return <SortableTableHeader key={String(idx)} disabled={!sortableSet.has(c)}
                                                    sortBy={sortBy as string} column={c} name={columnNames?.[c] || c}
                                                    isDescending={isDescending || false} onClick={updateSort}/>
                    })}
                </tr>
                </thead>
                <tbody>
                {sortedData.map((t, idx) => {
                    return (<tr key={idx}>
                        {columns?.map((col, colIdx) => {
                            return <td
                                key={colIdx}>{formatters?.[col] ? formatters?.[col](t[col], colIdx, t) : t[col]?.toString()}</td>
                        })}
                    </tr>)
                })}
                </tbody>
            </Table>
    )
}

interface SortableTableHeaderProps {
    sortBy: string,
    name: string,
    column: string,
    isDescending: boolean,
    onClick: (string) => void,
    key: string,
    disabled: boolean
}

const SortableTableHeader: FC<SortableTableHeaderProps> = ({
                                                               sortBy,
                                                               name, column, isDescending,
                                                               onClick,
                                                               disabled = false
                                                           }: SortableTableHeaderProps) => {

    const isSortedBy = sortBy === column
    return (
        <th onClick={disabled?() => {}:() => onClick(column)}>
            <div className="display-flex flex-row">
                <div>{name}</div>
                <div className="flex-1"></div>
            {!disabled && (isSortedBy ? <SortOrderIcon isDescending={isDescending}/> : <SortIcon/>)}
            </div>
        </th>
    )
}

interface SortIconProps {
    isDescending: boolean | undefined
}

const SortOrderIcon: FC<SortIconProps> = ({isDescending = false}) => {
    return (
        <img className={`margin-left-1 height-2 ${isDescending ? '' : 'sort-arrow-up'}`} src={SortArrow}
             alt={`Sorting ${isDescending ? 'descending' : 'ascending'}`}/>
    )
}

const SortIcon: FC = () => {
    return <img className={`margin-left-1 height-2 `} src={SortableIcon} alt="Sort by"/>
}