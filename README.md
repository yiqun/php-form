# php-form
PHP 表单插件

## 用法
引入静态文件
<pre>
&lt;link rel="stylesheet" href="static/todc-bootstrap/css/bootstrap.min.css"/&gt;
&lt;link rel="stylesheet" href="static/todc-bootstrap/css/todc-bootstrap.min.css"/&gt;
&lt;link rel="stylesheet" href="static/todc-select2-3.2/select2.css"/&gt;
&lt;link rel="stylesheet" href="static/font-awesome-4.3.0/css/font-awesome.min.css"/&gt;
&lt;link rel="stylesheet" href="static/img-uploader/img-uploader.min.css"/&gt;
&lt;link rel="stylesheet" href="static/summernote/summernote.css"/&gt;
&lt;link rel="stylesheet" href="static/summernote/summernote-bs3.css"/&gt;

&lt;script src="jQuery/file/path/jquery-1.11.0.min.js"&gt;&lt;/script&gt;
&lt;script src="static/todc-bootstrap/js/bootstrap.min.js"&gt;&lt;/script&gt;
&lt;script src="static/todc-select2-3.2/select2.min.js"&gt;&lt;/script&gt;
&lt;script src="static/img-uploader/img-uploader.js"&gt;&lt;/script&gt;
&lt;script src="static/cascadingSelector/cascadingSelector.js"&gt;&lt;/script&gt;
&lt;script src="static/summernote/summernote.js"&gt;&lt;/script&gt;
&lt;script src="static/summernote/lang/summernote-zh-CN.js"&gt;&lt;/script&gt;
</pre>

创建表单
<pre>
# 初始化
require_once 'Form.php';
$Form = new Form;
$Form->action = 'index.php';
$Form->method = 'post';
$Form->class='col-sm-12';
$Form->submitType = 'ajax';

# 添加表单元素：标题
$element = new Text;
$element->label = '标题';
$element->placeholder = '请输入标题';
$element->name = 'title';
$element->default = '';
$Form->addElement($element);

# 添加表单元素：类别
$element = new Select;
$element->label = '类别';
$element->name = 'cat_id';
$element->default = 0;
$element->options = array (
  array (
    'value' => '1',
    'text' => '如何付款和发票',
  ),
  array (
    'value' => '2',
    'text' => '出境游和港澳游常识',
  ),
  array (
    'value' => '3',
    'text' => '预定旅游产品',
  ),
  array (
    'value' => '4',
    'text' => '如何签订旅游合同',
  ),
);

$Form->addElement($element);

# 添加分割线
$Form->addElement(new Hr);

# 添加提交按钮
$element = new Button;
$element->type = 'submit';
$element->value = '<i class="glyphicon glyphicon-ok"></i> 提&nbsp;交';
$element->loadingText = '正在提交...';
$element->class = 'btn-primary btn-lg';
$element->style = 'width: 150px';
//$element->isDisabled = FALSE;

$Form->addElement($element);

# 设置提交超时时间
$Form->ajaxTimeout = 30;

# 渲染表单
echo $Form->render();
</pre>
