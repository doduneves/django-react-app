import React, { useContext } from 'react'
import { Button, Form } from 'semantic-ui-react'
import AuthContext from '../context/AuthContext'

export default function LoginPage() {
    const {loginUser} = useContext(AuthContext);

    return (
        <Form className="create-form" onSubmit={loginUser}>
            <Form.Field>
                <label>Name</label>
                <input type='text' name='username' placeholder='Enter Username'/>
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <input type='password' name='password' placeholder='Enter Password'/>
            </Form.Field>
            <Form.Field control={Button}>Login</Form.Field>

        </Form>
    )
}
