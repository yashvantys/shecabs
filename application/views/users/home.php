<div class="center-block">
	<div class="portlet-body">
		<div class="panel-group" id="accordion">
			<div class="panel panel-default">
				<div class="panel-heading panel-heading-custom"
					data-toggle="collapse" data-parent="#accordion"
					data-target="#collapseOne">
					<h6 class="panel-title pane-title-custom">
						<a class="accordion-toggle"> <b>User Management</b>
						</a>
					</h6>

				</div>

			</div>
		</div>
	</div>
</div>
<div class="portlet box center-block">
	<div id="ajaxResults"></div>
	<table class="demo table-bordered cell-border display users-list" id="userslist">
		<thead>
			<tr>
				<th colspan="8"><span class="search_client_form"><?php echo $searchform; ?></span>
                         <?php if($manageUsers):?>
                                <a data-toggle="modal" data-backdrop="static" data-keyboard="false">
									<button class="btn btn-default btn-xs pull-right add-users" onclick="add_users('<?php echo $this->session->userdata['role'];?>')">Add User</button>
								</a>
                         <?php endif;?>
                </th>
			</tr>
			<tr>
				<th>Email</th>
				<th>User Name</th>
				<th>Role</th>
				<th>Account Status</th>
				<th>Rejected Reason</th>
				<th>Client(s)</th>
				<th>Edit/Status</th>
				<th>Schedule</th>
				
			</tr>
		</thead>
		<tbody class="defaultprogress"></tbody>
	</table>

</div>
<div class="modal modal-wide fade" id="modal_form" role="dialog"
	data-backdrop="static" data-keyboard="false" data-refresh="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
					aria-hidden="true"></button>
				<h4 class="modal-title">Edit User</h4>
			</div>
			<div id="error-bubble"></div>
			<div class="modal-body">
				<div class="scroller" style="height: 410px" data-always-visible="1"
					data-rail-visible1="1">
					<div class="row showhidecontent">
							<?php echo @$form;?>                                                
                    </div>
                   <div id="ajaxloader"></div>
				</div>
				
			</div>
           
		</div>
		
	</div>
</div>

<div class="modal modal-wide fade" id="useraddform" role="dialog"
	data-backdrop="static" data-keyboard="false" data-refresh="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
					aria-hidden="true"></button>
				<h4 class="modal-title">Add User</h4>
			</div>
			<div id="errorbubbles"></div>
			<div class="modal-body">
				<div class="scroller" style="height: 460px" data-always-visible="1"
					data-rail-visible1="1">
					<div class="row showhidecontentadd">
						<?php echo @$adduserform;?>  		
					</div>
                   <div id="ajaxloaderadd"></div>
				</div>
			</div>

		</div>
	</div>
</div>

<div class="modal modal-wide fade" id="userscheduleform" role="dialog"
	data-backdrop="static" data-keyboard="false" data-refresh="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
					aria-hidden="true"></button>
				<h4 class="modal-title_sche">Schedule Report</h4>
			</div>
			<div id="ajaxResultsschedule"></div>
			<div class="modal-body">
				<div class="scroller" style="height: 280px" data-always-visible="1"
					data-rail-visible1="1">
					<div class="row showhidecontentschedule">
						
					</div>
                   <div id="ajaxloaderschedule"></div>
				</div>
			</div>

		</div>
	</div>
</div>
