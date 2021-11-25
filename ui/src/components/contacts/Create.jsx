import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

import { Button, Form, Message } from 'semantic-ui-react'
import useAxios from '../../utils/useAxios';

export default function Create() {
    const api = useAxios()

    const [contact, setContact] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    function handleContactForm(e){
        const targetName = e.target.name;
        const val = e.target.value;

        if (targetName === 'name'){
            setContact({...contact, name: val});
        }

        if (targetName === 'email'){
            setContact({...contact, email: val});
        }
    }

    async function postData() {
        try{
            if (!contact.name || !contact.email){
                setErrorMessage('Please fill all required fields')
                return
            }

            const postedData = await api.post('api/contacts/', contact )

            if (postedData.status === 201){
                setErrorMessage('')
                navigate('/')
            }

        }catch(e){
            console.log(e)
            setErrorMessage(e.message)
        }
    }

    return (
        <>
            {errorMessage &&
                <Message negative>
                    <b>Some problem creating a new user:</b><br/>
                    {errorMessage}
                </Message>
            }
            <h3>Create New Contact</h3>

            <Form className="create-form">
                <Form.Field required>
                    <label>Name</label>
                    <input placeholder='User name' name='name' onChange={handleContactForm}/>
                </Form.Field>
                <Form.Field required>
                    <label>Email</label>
                    <input placeholder='example@contact.com' name='email' onChange={handleContactForm}/>
                </Form.Field>
                <Button onClick={postData} type='submit'>Create</Button>
            </Form>
        </>
    )
}
