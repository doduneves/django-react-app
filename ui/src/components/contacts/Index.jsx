import React, { useCallback, useContext, useEffect, useState } from 'react'

import { Button, Icon, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import useAxios from '../../utils/useAxios'

import AuthContext from '../../context/AuthContext'

export default function Contacts() {
    const [ contacts, setContacts ] = useState([]);
    const { user } = useContext(AuthContext);

    const api = useAxios()


    const getAllContacts = useCallback(async () => {
        const res = await api.get('/api/contacts/');
        const contacts = await res.data;
        setContacts(contacts)
    }, [api])

    async function deleteContact(id){
        const res = await api.delete(`/api/contacts/${id}/`);
    }

    useEffect(() => {
        getAllContacts()
    }, [getAllContacts])


    return (
        <>
            {contacts.length ? <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        {user.is_superuser && <Table.HeaderCell></Table.HeaderCell>}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {contacts?.map((contact, index) => {
                    return (
                        <Table.Row key={index}>
                            <Table.Cell>{contact.id}</Table.Cell>
                            <Table.Cell>{contact.name}</Table.Cell>
                            <Table.Cell>{contact.email}</Table.Cell>
                            {user.is_superuser &&
                                <Table.Cell>
                                    {/* <Link to={`/edit/${contact.id}`}>
                                        <Button size='tiny' icon basic color='green'>
                                            <Icon onClick={''} color='green' name='edit' />
                                        </Button>
                                    </Link> */}
                                    <Link to="">
                                        <Button onClick={() => deleteContact(contact.id)} size='tiny' icon basic color='red'>
                                            <Icon color='red' name='trash alternate outline' />
                                        </Button>
                                    </Link>
                                </Table.Cell>
                            }
                        </Table.Row>
                    )
                    })}
                </Table.Body>
            </Table> :
            <span>No contacts on your list :(</span>
            }
            { (user.is_staff) ?
                (<Link to="/create">
                    <Button primary floated='right'>
                        Create New Contact
                    </Button>
                </Link>)
            : null}
        </>
    )
}
