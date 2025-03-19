import { Button } from '@mui/material';
import * as React from 'react';
import API from '../../api/api';
import PupringProperties from '../../components/tabs/pupringProperties';

export default function TicketActionBtns(props) {
  

  return (
    <div className='ticket-action-btns'>
      <PupringProperties {...props}/>
    </div>
  );
}
