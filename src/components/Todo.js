import React, { useState, useEffect } from 'react';

/* 
  【Todoのデータ構成】
　・key：Todoを特定するID（String）
　・text：Todoの内容（String）
　・done：完了状態（Boolean true:完了済み,, false:未完了）
*/

/* コンポーネント */
import TodoItem from './TodoItem';
import Input from './Input';
import Filter from './Filter';

/* カスタムフック */
import useStorage from '../hooks/storage';

/* ライブラリ */
import {getKey} from "../lib/util";

function Todo() {
  // const [items, putItems] = React.useState([
  //     /* テストコード 開始 */
  //   { key: getKey(), text: '日本語の宿題', done: false },
  //   { key: getKey(), text: 'reactを勉強する', done: false },
  //   { key: getKey(), text: '明日の準備をする', done: false },
  //   /* テストコード 終了 */
  // ]);

  const [content, setContent] = useState('');
  const [tabSelected, setTabSelected] = useState(0);
  const [items, putItems, clearItems] = useStorage();

  const tabs = ['全て', '未完了', '完了済み'];

  const onSubmit = () => {
    putItems([...items, { key: getKey(), text: content, done: false }]);
    setContent('');
  }

  const onUpdate = (data) => {
    const index = items.findIndex(item => item.key === data.key);
    const new_arr = [...items];
    if(index != -1){
      new_arr[index].done = !data.done;
      putItems([...new_arr]);
    }
  };

  const getLists = () => {
    switch(tabSelected){
      case 0: return items;
      case 1: return items.filter(item => item.done);
      case 2: return items.filter(item => !item.done);
      default: return [];
    }
  }

  const onRemove = () => {
    clearItems();
  } 

  return (
    <div className="panel">
      <div className="panel-heading">
        ITSS ToDoアプリ
      </div>
      <input type='text'
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder='Todoを入力してください'
        onKeyUp={e => {
          if(e.key === 'Enter')
            onSubmit()
        }}/>
      
      <div className='tabs'>
        {
          tabs.map((tab, index) => (<div className={`tab ${index === tabSelected ? 'active' : ''}`} key={index} onClick={() => setTabSelected(index)} >{tab}</div>))
        }
      </div>
      
      {getLists().map(item => (
        <label key={item.key} className="panel-block">
          <TodoItem item={item} onClick={(data) => onUpdate(data)} />
        </label>
      ))}

      <div className="panel-block">
        {items.length} items
      </div>

      <input
        type='submit'
        value='全てTodoを削除'
        onClick={onRemove}
      />
      
    </div>
  );
}

export default Todo;