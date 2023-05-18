import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {
    total: number;
    limit: number;
    page: number;
    firstPage: number;
    lastPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setLastPage: React.Dispatch<React.SetStateAction<number>>;
    setFirstPage: React.Dispatch<React.SetStateAction<number>>;
}

export function Pagination({
    total,
    limit,
    page,
    firstPage,
    lastPage,
    setPage,
    setLastPage,
    setFirstPage,
}: Props) {
    const [click, setClick] = useState<number>(0);
    const numPages = Math.ceil(total / limit);
    // console.log(
    //     'firstPage: ',
    //     firstPage,
    //     'lastPage: ',
    //     lastPage,
    //     'click: ',
    //     click
    // );
    // console.log('page: ', page, 'numPages: ', numPages);
    let local_page: number = 1;
    let local_firstPage: number = 0;
    let local_lastPage: number = 5;

    return (
        <>
            <Nav>
                <Button
                    onClick={() => {
                        setClick((res) => res - 1);
                        if (page - 5 <= 5) {
                            local_page = 5;
                            local_firstPage = 0;
                            local_lastPage = 5;

                            setPage(5);
                            setFirstPage(0);
                            setLastPage(5);
                        } else {
                            local_page = Math.floor(page / 5) * 5;
                            local_firstPage = Math.floor(page / 5) * 5 - 5;
                            local_lastPage = Math.floor(page / 5) * 5;

                            setPage(Math.floor(page / 5) * 5);
                            setFirstPage(Math.floor(page / 5) * 5 - 5);
                            setLastPage(Math.floor(page / 5) * 5);
                        }

                        localStorage.setItem('page', local_page.toString());
                        localStorage.setItem(
                            'firstPage',
                            local_firstPage.toString()
                        );
                        localStorage.setItem(
                            'lastPage',
                            local_lastPage.toString()
                        );
                    }}
                    disabled={page - 5 < 1}
                >
                    &lt;
                </Button>
                {numPages &&
                    Array(numPages)
                        .fill(undefined)
                        .map((_, i) => {
                            if (firstPage <= i && i < lastPage) {
                                return (
                                    <Button
                                        key={i + 1}
                                        onClick={() => {
                                            local_page = i + 1;
                                            localStorage.setItem(
                                                'page',
                                                local_page.toString()
                                            );

                                            setPage(i + 1);
                                        }}
                                        aria-current={
                                            page === i + 1 ? 'page' : undefined
                                        }
                                    >
                                        {i + 1}
                                    </Button>
                                );
                            }
                        })}
                <Button
                    onClick={() => {
                        setClick((res) => res + 1);

                        if (page + 5 < numPages) {
                            local_firstPage = firstPage + 5;
                            local_lastPage = lastPage + 5;

                            setFirstPage((res) => res + 5);
                            setLastPage((res) => res + 5);
                        } else {
                            if (firstPage + 5 < lastPage) {
                                local_firstPage = firstPage;

                                setFirstPage((res) => res);
                            } else {
                                local_firstPage = firstPage + 5;

                                setFirstPage((res) => res + 5);
                            }

                            local_lastPage = numPages;

                            setLastPage(numPages);
                        }
                        local_page = Math.ceil(page / 5) * 5 + 1;

                        setPage((res) => Math.ceil(page / 5) * 5 + 1);

                        localStorage.setItem('page', local_page.toString());
                        localStorage.setItem(
                            'firstPage',
                            local_firstPage.toString()
                        );
                        localStorage.setItem(
                            'lastPage',
                            local_lastPage.toString()
                        );
                    }}
                    disabled={
                        numPages % 5 === 0
                            ? numPages - 4 <= page
                            : numPages - click * 5 < 5
                    }
                >
                    &gt;
                </Button>
            </Nav>
        </>
    );
}

const Nav = styled.nav`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin: 16px;
`;

const Button = styled.button`
    border: none;
    border-radius: 8px;
    padding: 8px;
    margin: 0;
    background: black;
    color: white;
    font-size: 1rem;

    &:hover {
        background: tomato;
        cursor: pointer;
        transform: translateY(-2px);
    }

    &[disabled] {
        background: grey;
        cursor: revert;
        transform: revert;
    }

    &[aria-current] {
        background: deeppink;
        font-weight: bold;
        cursor: revert;
        transform: revert;
    }
`;
