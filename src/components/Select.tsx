import React, { useEffect, useRef, useState } from "react"
import styles from "./select.module.css"

type SelectOption = {
    label: string
    value: number | string
}

type SingleSelectProps = {
    multiple?: false
    value: SelectOption | undefined
    onChange: (value: SelectOption | undefined) => void
}

type MultipleSelectProps = {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

const Select = ({ multiple, value, onChange, options }: SelectProps) => {

    const [isOpen, SetIsOpen] = useState<boolean>(false)
    const [highlihtedIndex, SetHighlightedIndex] = useState<number>(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const clearOptions = () => {
        multiple ? onChange([]) : onChange(undefined)
    }

    const slectOption = (opt: SelectOption) => {
        if (multiple) {
            if (value.includes(opt)) {
                onChange(value.filter(o => o.value !== opt.value))
            } else {
                onChange([...value, opt])
            }
        } else {
            if (onChange && opt?.value !== value?.value) { onChange(opt) }
            SetIsOpen(false)
        }
    }

    const isOptionSelected = (opt: SelectOption) => {
        return multiple ? value.includes(opt) : opt?.value === value?.value
    }

    const displayOptions = (value: SelectOption[]) => {
        return value ? value.map(o => {
            return <button
                key={o?.value}
                onClick={e => {
                    e.stopPropagation()
                    slectOption(o)
                }}
                className={styles["option-badge"]}
            >
                {o?.label}
                <span className={styles["remove-btn"]}>&times;</span>
            </button>
        }) : <></>
    }

    useEffect(() => {
        if (isOpen) SetHighlightedIndex(0)
    }, [isOpen])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            console.log("keyboard: ", e)
            if (e.target !== containerRef.current) {
                console.log("not_e: ", e.target)
                console.log("not: ", containerRef.current)
                return
            } else {
                console.log("yes_e: ", e.target)
                console.log("yes: ", containerRef.current)

                switch (e.code) {
                    case "Enter":
                    case "Space":
                        SetIsOpen(prev => !prev)
                        if (isOpen) {
                            slectOption(options[highlihtedIndex])
                        }
                        break
                    case "ArrowDown":
                    case "ArrowUp": {
                        if (!isOpen && e.code === "ArrowDown") SetIsOpen(true)

                        const val: number = highlihtedIndex + (e.code === "ArrowDown" ? 1 : -1)
                        if (val >= 0 && val < options.length) {
                            SetHighlightedIndex(val)
                        }
                        break
                    }
                    case "Escape":
                        SetIsOpen(false)
                        break
                }
            }
        }

        containerRef.current?.addEventListener("keydown", handler)

        return () => {
            containerRef.current?.removeEventListener("keydown", handler)
        }
    }, [isOpen, highlihtedIndex, options])

    return (
        <div
            ref={containerRef}
            onBlur={() => { SetIsOpen(false) }}
            onClick={() => { SetIsOpen(prev => !prev) }}
            tabIndex={0}
            className={styles.container}>

            {/* Display options - start */}
            <span className={styles.value}>
                {multiple ? displayOptions(value) : value?.label}
            </span>
            {/* Display options - start */}

            {/* Side buttons -start */}
            <button
                className={styles["clear-btn"]}
                onClick={e => {
                    console.log("e: ", e)
                    e.stopPropagation()
                    clearOptions()
                }}
            >
                &times;
            </button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            {/* Side buttons -end */}

            {/* Dropdown options - start */}
            <ul className={`${styles.options} ${isOpen ? styles.show : null}`}>
                {options.map((option, index) => {
                    return (
                        <li
                            key={option.value}
                            className={`
                                ${styles.option} 
                                ${isOptionSelected(option) ? styles.selected : ""}
                                ${index === highlihtedIndex ? styles.highlighted : ""}
                                `}
                            onClick={e => {
                                e.stopPropagation()
                                slectOption(option)
                            }}
                            onMouseEnter={() => SetHighlightedIndex(index)}
                        >
                            {option.label}
                        </li>
                    )
                })}
            </ul>
            {/* Dropdown options - End */}
        </div>
    )
}

export default Select