# web������ִ����
Ŀ�꣺Զ��ִ�о������� ����ͨ��webҳ�������չ��״̬����
* Զ��ִ�о��������� ���ɶ�����������
* web�˲���������з�ʽ ������ִ�ж������
* web��ͬ������״̬ չʾ��ʹ����

## ����
* Զ�̱���ui+�ͻ��˴��� ����Ȩ������
* Զ����������h5��; ��Ϊu3d �ɽ����µı���汾�ϴ�svn �߻��ֶ����µ��Լ��ĵ���
* Զ���Զ����ȸ���
* Զ���Զ�ͬ��������Դ

```
anywhere 9100
   index.html
   main.js  -- ts export es6
      | http_request
      | proj_view  ҳ������
      | pluginMgrClient
        | plugin_file_sync
        | plugin_status_sync
        | plugin_job_group_sender



node main.js  -- ts export commonjs
        | createHttp(request, response)
        | pluginMgrSvr
            | plugin_file_sync
            | plugin_status_sync
            | plugin_cmd_sync
                | job_group_executer
                    | job_cmd
                

```




