import styled from "styled-components";
import colors from "../../styles/colors";

export const AdminContainer = styled.div`

    .bold{
        font-weight: bold;
    }
    h1{
        font-size: 20px;
        margin: 0 auto;
        margin-bottom: 20px;
        width: fit-content;
    }

    form{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        border-bottom: 1px solid ${colors.lightGray};
        padding: 5px 0;
        margin: 25px 0;
    }

    label{
        font-size: 14px;
        margin-right: 5px;
    }

    .button-box{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button{
        width: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 10px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        border-radius: 5px;
        font-size: 12px;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    button:hover{
        opacity: 0.8;
    }

    select {
        padding: 2px 12px;
        font-size: 14px;
        color: #333;
        background-color: #f8f8f8;
        border: 1px solid #ccc;
        border-radius: 8px;
        outline: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    select:hover {
        border-color: #888;
    }

    select:focus {
        border-color: #007acc;
        box-shadow: 0 0 4px rgba(0, 122, 204, 0.5);
    }

    select::-ms-expand {
        display: none;
    }

    select {
        -webkit-appearance: none; 
        -moz-appearance: none; 
        appearance: none;
        padding-right: 24px;
        position: relative;
    }

    select::after {
        content: '▼';
        position: absolute;
        right: 10px;
        pointer-events: none;
        color: #888;
        font-size: 12px;
        top: 50%;
        transform: translateY(-50%);
    }

    .actual-model{
        font-size: 12px;
        margin: 10px 0; 
        width: fit-content;
    }

    .actual-model span{
        color: #12ac0a;
        margin-left: 10px;
    }

    .file-input-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .file-input {
        display: none;
    }

    .file-label {
        max-width: 200px;
        text-align: center;
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border-radius: 5px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        margin: 0;
    }
    .file-name {
        font-size: 14px;
        color: #666;
        font-style: italic;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }

    .label-box{
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .text-input{
        width: 100%;
        padding: 5px 10px;
        border-radius: 5px;
        border: 1px solid ${colors.lightGray};
        font-size: 14px;
        color: ${colors.primary};
        background-color: ${colors.white};
    }
}

`;