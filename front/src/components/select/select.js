import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export const SelectAutoWidth = () => {
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={'Single'}
            onChange={handleChange}
            autoWidth
            style={{ width: '200px', marginTop: '15px', borderRadius: '0%', border: 'none' }}

        >

            <MenuItem style={{ width: '200px' }} value={'Single'}>Single</MenuItem>
            <MenuItem style={{ width: '200px' }} value={'Married'}>Married</MenuItem>
            <MenuItem style={{ width: '200px' }} value={'Divorced'}>Divorced</MenuItem>
            <MenuItem style={{ width: '200px' }} value={'Widowed'}>Widowed</MenuItem>

        </Select>
    );
}
