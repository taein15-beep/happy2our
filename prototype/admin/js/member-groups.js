(function () {
  var typeLabel = {
    web: '웹회원',
    admin: '관리자/직원',
    seller: '판매점',
    partner: '거래처'
  };

  var groups = [
    { id: 'g1', type: 'admin', name: '최고관리자', code: 'SUPER_ADMIN', description: '전체 메뉴와 전체 데이터에 접근 가능한 시스템 최고 권한 그룹', isDefault: 'Y', active: 'Y', members: 1, sort: 1, updatedAt: '2026-07-01', systemLocked: true },
    { id: 'g2', type: 'admin', name: '일반관리자', code: 'ADMIN_DEFAULT', description: '관리자/직원 기본 권한 그룹', isDefault: 'Y', active: 'Y', members: 4, sort: 2, updatedAt: '2026-06-30', systemLocked: true },
    { id: 'g3', type: 'admin', name: '예약관리팀', code: 'ADMIN_RESERVATION', description: '예약 현황과 예약 등록 업무 중심 권한', isDefault: 'N', active: 'Y', members: 3, sort: 3, updatedAt: '2026-06-28' },
    { id: 'g4', type: 'admin', name: '정산관리팀', code: 'ADMIN_ACCOUNTING', description: '판매점/거래처 정산과 인보이스 관리 권한', isDefault: 'N', active: 'Y', members: 2, sort: 4, updatedAt: '2026-06-26' },
    { id: 'g5', type: 'web', name: '일반 웹회원', code: 'WEB_DEFAULT', description: '일반 고객 회원 기본 그룹', isDefault: 'Y', active: 'Y', members: 248, sort: 10, updatedAt: '2026-06-25', systemLocked: true },
    { id: 'g6', type: 'web', name: 'VIP 웹회원', code: 'WEB_VIP', description: '우수 고객 대상 혜택 그룹', isDefault: 'N', active: 'Y', members: 32, sort: 11, updatedAt: '2026-06-20' },
    { id: 'g7', type: 'seller', name: '기본 판매점', code: 'SELLER_DEFAULT', description: '판매점 가입 시 기본으로 부여되는 그룹', isDefault: 'Y', active: 'Y', members: 18, sort: 20, updatedAt: '2026-06-18', systemLocked: true },
    { id: 'g8', type: 'seller', name: '우수 판매점', code: 'SELLER_PRIORITY', description: '우수 판매점 전용 운영 권한 그룹', isDefault: 'N', active: 'Y', members: 7, sort: 21, updatedAt: '2026-06-15' },
    { id: 'g9', type: 'partner', name: '기본 거래처', code: 'PARTNER_DEFAULT', description: '거래처 기본 접근 권한 그룹', isDefault: 'Y', active: 'Y', members: 12, sort: 30, updatedAt: '2026-06-14', systemLocked: true }
  ];

  var accounts = [
    { id: 'a1', name: '김관리', login: 'superadmin', type: 'admin', groupId: 'g1', groupStatus: '전체 권한 적용', override: 'group', updatedAt: '2026-07-01' },
    { id: 'a2', name: '예약팀 박민지', login: 'reserve01', type: 'admin', groupId: 'g3', groupStatus: '예약관리팀 권한 적용', override: 'allow', updatedAt: '2026-06-28' },
    { id: 'a3', name: '정산팀 최정우', login: 'account01', type: 'admin', groupId: 'g4', groupStatus: '정산관리팀 권한 적용', override: 'group', updatedAt: '2026-06-26' },
    { id: 'a4', name: '제주로컬투어', login: 'jeju_seller', type: 'seller', groupId: 'g8', groupStatus: '우수 판매점 권한 적용', override: 'deny', updatedAt: '2026-06-25' },
    { id: 'a5', name: '해담정', login: 'partner_food01', type: 'partner', groupId: 'g9', groupStatus: '기본 거래처 권한 적용', override: 'group', updatedAt: '2026-06-21' }
  ];

  var menuTree = [
    { id: 'dashboard', name: '대시보드', children: [] },
    { id: 'product', name: '상품관리', children: [
      { id: 'product_list', name: '상품목록' },
      { id: 'product_register', name: '상품등록' },
      { id: 'price_setting', name: '요금설정' },
      { id: 'schedule_register', name: '일정표관리' }
    ] },
    { id: 'reservation', name: '예약관리', children: [
      { id: 'reservation_status', name: '예약현황' },
      { id: 'reservation_register', name: '예약등록' },
      { id: 'reservation_cancel', name: '예약취소관리' }
    ] },
    { id: 'member', name: '회원관리', children: [
      { id: 'web_member', name: '웹회원관리' },
      { id: 'admin_member', name: '관리자/직원관리' },
      { id: 'seller_member', name: '판매점관리' },
      { id: 'partner_member', name: '거래처관리' },
      { id: 'group_member', name: '그룹관리' }
    ] },
    { id: 'settlement', name: '정산관리', children: [
      { id: 'seller_settlement', name: '판매점정산' },
      { id: 'partner_settlement', name: '거래처정산' },
      { id: 'invoice', name: '인보이스관리' }
    ] },
    { id: 'statistics', name: '통계관리', children: [
      { id: 'product_stats', name: '상품별통계' },
      { id: 'seller_stats', name: '판매점별통계' },
      { id: 'reservation_stats', name: '예약통계' }
    ] },
    { id: 'board', name: '게시판관리', children: [] },
    { id: 'system', name: '시스템설정', children: [] }
  ];

  var selectedDeleteId = '';
  var selectedPermissionGroupId = '';
  var selectedAccountId = '';

  function $(id) {
    return document.getElementById(id);
  }

  function notify(message) {
    if (typeof window.msg === 'function') window.msg(message);
    else window.alert(message);
  }

  function badge(text, cls) {
    return '<span class="badge ' + cls + '">' + text + '</span>';
  }

  function groupById(id) {
    return groups.find(function (group) { return group.id === id; });
  }

  function canDelete(group) {
    return group && !group.systemLocked && Number(group.members || 0) < 1;
  }

  function deleteReason(group) {
    if (!group) return '그룹 정보를 찾을 수 없습니다.';
    if (group.systemLocked) return '시스템 기본 그룹은 삭제할 수 없습니다.';
    if (Number(group.members || 0) > 0) return '가입수가 1명 이상인 그룹은 삭제할 수 없습니다.';
    return '';
  }

  function filteredGroups() {
    var type = $('filterType').value;
    var active = $('filterActive').value;
    var isDefault = $('filterDefault').value;
    var keyword = $('filterKeyword').value.trim().toLowerCase();
    return groups.filter(function (group) {
      var keywordMatched = !keyword || [group.name, group.code].join(' ').toLowerCase().indexOf(keyword) >= 0;
      return keywordMatched
        && (!type || group.type === type)
        && (!active || group.active === active)
        && (!isDefault || group.isDefault === isDefault);
    }).sort(function (a, b) { return Number(a.sort) - Number(b.sort); });
  }

  function renderGroups() {
    var rows = filteredGroups();
    $('groupCountText').textContent = '총 ' + rows.length + '개';
    $('groupRows').innerHTML = rows.map(function (group, index) {
      var locked = !canDelete(group);
      var lockTitle = locked ? deleteReason(group) : '삭제 가능';
      return '<tr>'
        + '<td class="center"><input type="checkbox" data-group-check="' + group.id + '" ' + (locked ? 'disabled title="' + lockTitle + '"' : '') + '></td>'
        + '<td class="center">' + (index + 1) + '</td>'
        + '<td class="center">' + badge(typeLabel[group.type], group.type === 'admin' ? 'b-blue' : group.type === 'web' ? 'b-green' : group.type === 'seller' ? 'b-purple' : 'b-orange') + '</td>'
        + '<td><div class="group-name-cell"><strong>' + group.name + '</strong><small>' + group.code + '</small></div></td>'
        + '<td>' + group.code + '</td>'
        + '<td>' + group.description + '</td>'
        + '<td class="center">' + (group.isDefault === 'Y' ? badge('기본그룹', 'b-orange') : badge('일반그룹', 'b-gray')) + '</td>'
        + '<td class="center">' + (group.active === 'Y' ? badge('사용', 'b-green') : badge('미사용', 'b-gray')) + '</td>'
        + '<td class="center">' + group.members + '명</td>'
        + '<td class="center">' + group.sort + '</td>'
        + '<td class="center">' + group.updatedAt + '</td>'
        + '<td class="center"><button class="btn small" type="button" data-group-action="permission" data-id="' + group.id + '" ' + (group.type === 'web' ? 'disabled title="웹회원 그룹은 관리자 메뉴 권한 대상이 아닙니다."' : '') + '>권한설정</button></td>'
        + '<td class="center"><button class="btn small" type="button" data-group-action="edit" data-id="' + group.id + '">수정</button></td>'
        + '<td class="center"><button class="btn small red" type="button" data-group-action="delete" data-id="' + group.id + '" ' + (locked ? 'disabled title="' + lockTitle + '"' : '') + '>삭제</button></td>'
        + '</tr>';
    }).join('') || '<tr><td colspan="14" class="empty">검색된 그룹이 없습니다.</td></tr>';
  }

  function renderAccounts() {
    $('accountRows').innerHTML = accounts.map(function (account) {
      var group = groupById(account.groupId);
      var overrideBadge = account.override === 'allow' ? badge('개별 허용 있음', 'b-blue') : account.override === 'deny' ? badge('개별 차단 있음', 'b-red') : badge('없음', 'b-gray');
      return '<tr>'
        + '<td><strong>' + account.name + '</strong></td>'
        + '<td>' + account.login + '</td>'
        + '<td class="center">' + badge(typeLabel[account.type], account.type === 'admin' ? 'b-blue' : account.type === 'seller' ? 'b-purple' : 'b-orange') + '</td>'
        + '<td>' + (group ? group.name : '-') + '</td>'
        + '<td>' + account.groupStatus + '</td>'
        + '<td class="center">' + overrideBadge + '</td>'
        + '<td class="center">' + account.updatedAt + '</td>'
        + '<td class="center"><button class="btn small" type="button" data-group-action="account-permission" data-id="' + account.id + '">개별권한 설정</button></td>'
        + '</tr>';
    }).join('');
  }

  function openModal(id) {
    $(id).classList.add('open');
    $(id).setAttribute('aria-hidden', 'false');
  }

  function closeModal(id) {
    $(id).classList.remove('open');
    $(id).setAttribute('aria-hidden', 'true');
  }

  function openGroupForm(group) {
    $('groupForm').reset();
    $('groupId').value = group ? group.id : '';
    $('groupModalTitle').textContent = group ? '그룹수정' : '그룹등록';
    $('groupType').value = group ? group.type : '';
    $('groupName').value = group ? group.name : '';
    $('groupCode').value = group ? group.code : '';
    $('groupDescription').value = group ? group.description : '';
    $('groupDefault').value = group ? group.isDefault : 'N';
    $('groupActive').value = group ? group.active : 'Y';
    $('groupSort').value = group ? group.sort : groups.length + 1;
    $('groupLockNotice').classList.toggle('hidden', !(group && group.systemLocked));
    openModal('groupModal');
  }

  function saveGroup(event) {
    event.preventDefault();
    var id = $('groupId').value || 'g' + Date.now();
    var row = {
      id: id,
      type: $('groupType').value,
      name: $('groupName').value.trim(),
      code: $('groupCode').value.trim().toUpperCase(),
      description: $('groupDescription').value.trim(),
      isDefault: $('groupDefault').value,
      active: $('groupActive').value,
      members: 0,
      sort: Number($('groupSort').value || 999),
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    if (!row.type || !row.name || !row.code) {
      notify('그룹유형, 그룹명, 그룹코드는 필수입니다.');
      return;
    }
    var existing = groupById(id);
    if (existing) {
      row.members = existing.members;
      row.systemLocked = existing.systemLocked;
      Object.assign(existing, row);
    } else {
      groups.push(row);
    }
    closeModal('groupModal');
    renderGroups();
    notify('그룹 정보가 저장되었습니다.');
  }

  function openDelete(group) {
    selectedDeleteId = group.id;
    var reason = deleteReason(group);
    $('deleteMessage').textContent = group.name + ' 그룹을 삭제하시겠습니까?';
    $('deleteBlockReason').textContent = reason;
    $('deleteBlockReason').classList.toggle('hidden', !reason);
    $('confirmDeleteButton').disabled = !!reason;
    openModal('deleteModal');
  }

  function confirmDelete() {
    var group = groupById(selectedDeleteId);
    if (!canDelete(group)) {
      notify(deleteReason(group));
      return;
    }
    groups = groups.filter(function (item) { return item.id !== selectedDeleteId; });
    selectedDeleteId = '';
    closeModal('deleteModal');
    renderGroups();
    notify('그룹이 삭제되었습니다.');
  }

  function defaultPermValue(group, menuId, field) {
    if (group && group.code === 'SUPER_ADMIN') return true;
    if (field === 'use' || field === 'view') return true;
    if (group && group.type === 'partner' && (field === 'edit' || field === 'delete')) return false;
    return menuId.indexOf('settlement') < 0;
  }

  function renderPermissionTree(targetId, group, accountMode) {
    var target = $(targetId);
    target.innerHTML = menuTree.map(function (menu) {
      return renderNode(menu, group, true, accountMode);
    }).join('');
    syncAllPermissionStates(target);
  }

  function renderNode(menu, group, isParent, accountMode) {
    var fields = ['use', 'view', 'edit', 'delete'];
    var checks = fields.map(function (field) {
      var checked = defaultPermValue(group, menu.id, field) ? 'checked' : '';
      return '<label class="permission-check"><input type="checkbox" data-perm="' + field + '" data-menu-id="' + menu.id + '" ' + checked + '> ' + labelForPerm(field) + '</label>';
    }).join('');
    var children = (menu.children || []).map(function (child) {
      return renderNode(child, group, false, accountMode);
    }).join('');
    return '<div class="permission-node ' + (isParent ? 'parent' : 'child') + '" data-node-id="' + menu.id + '" data-parent-node="' + (isParent ? '' : 'child') + '">'
      + '<div class="permission-row">'
      + '<div class="permission-menu-title"><strong>' + menu.name + '</strong>' + (isParent && menu.children.length ? '<small>하위 ' + menu.children.length + '개</small>' : '') + '</div>'
      + checks
      + '</div>'
      + (children ? '<div class="permission-children">' + children + '</div>' : '')
      + '</div>';
  }

  function labelForPerm(field) {
    return { use: '메뉴사용', view: '조회', edit: '등록/수정', delete: '삭제' }[field];
  }

  function syncAllPermissionStates(root) {
    root.querySelectorAll('.permission-node').forEach(function (node) {
      syncNodeState(node);
    });
  }

  function syncNodeState(node) {
    var use = node.querySelector(':scope > .permission-row input[data-perm="use"]');
    var children = Array.prototype.slice.call(node.querySelectorAll(':scope > .permission-children > .permission-node'));
    var dependent = Array.prototype.slice.call(node.querySelectorAll(':scope > .permission-row input[data-perm="view"], :scope > .permission-row input[data-perm="edit"], :scope > .permission-row input[data-perm="delete"]'));
    var disabled = use && !use.checked;
    dependent.forEach(function (input) {
      input.disabled = disabled;
      input.closest('.permission-check').classList.toggle('disabled', disabled);
      if (disabled) input.checked = false;
    });
    children.forEach(function (child) {
      child.querySelectorAll('input').forEach(function (input) {
        input.disabled = disabled;
        input.closest('.permission-check').classList.toggle('disabled', disabled);
        if (disabled) input.checked = false;
      });
      if (!disabled) syncNodeState(child);
    });
  }

  function handlePermissionChange(event) {
    var input = event.target;
    if (!input.matches('.permission-tree input[type="checkbox"]')) return;
    var node = input.closest('.permission-node');
    var perm = input.getAttribute('data-perm');
    if (perm === 'edit' || perm === 'delete') {
      var view = node.querySelector(':scope > .permission-row input[data-perm="view"]');
      if (input.checked && view) view.checked = true;
    }
    if (perm === 'view' && !input.checked) {
      ['edit', 'delete'].forEach(function (field) {
        var child = node.querySelector(':scope > .permission-row input[data-perm="' + field + '"]');
        if (child) child.checked = false;
      });
    }
    if (perm === 'use') {
      syncNodeState(node);
      var parentNode = node.closest('.permission-children') ? node.closest('.permission-children').closest('.permission-node') : null;
      if (parentNode) {
        var parentUse = parentNode.querySelector(':scope > .permission-row input[data-perm="use"]');
        var anyChildUse = Array.prototype.some.call(parentNode.querySelectorAll(':scope > .permission-children > .permission-node > .permission-row input[data-perm="use"]'), function (childUse) {
          return childUse.checked;
        });
        if (parentUse) parentUse.checked = anyChildUse || parentUse.checked;
      }
    }
  }

  function openPermission(group) {
    if (group.type === 'web') {
      notify('웹회원 그룹은 관리자 메뉴 권한 설정 대상이 아닙니다.');
      return;
    }
    selectedPermissionGroupId = group.id;
    $('permGroupName').textContent = group.name;
    $('permGroupType').textContent = typeLabel[group.type];
    $('permGroupCode').textContent = group.code;
    $('permissionNotice').textContent = group.code === 'SUPER_ADMIN'
      ? '최고관리자 그룹은 모든 메뉴 권한이 기본 체크되어 있습니다. 수정 시 운영 영향이 크므로 주의하세요.'
      : '메뉴사용을 해제하면 하위 메뉴와 조회/등록·수정/삭제 권한이 함께 비활성화됩니다.';
    renderPermissionTree('permissionTree', group);
    renderHistory(group);
    openModal('permissionModal');
  }

  function renderHistory(group) {
    $('historyRows').innerHTML = [
      ['2026-07-01 09:30', 'superadmin', group.name, '권한 샘플 초기화', '-', '메뉴 권한 생성'],
      ['2026-06-29 16:12', 'admin01', group.name, '조회 권한 조정', '일부 메뉴 조회 불가', '예약관리 조회 허용'],
      ['2026-06-21 11:04', 'admin01', group.name, '삭제 권한 점검', '삭제 허용', '삭제 제한']
    ].map(function (row) {
      return '<tr>' + row.map(function (cell) { return '<td>' + cell + '</td>'; }).join('') + '</tr>';
    }).join('');
  }

  function openAccountPermission(account) {
    var group = groupById(account.groupId);
    selectedAccountId = account.id;
    $('accountPermName').textContent = account.name;
    $('accountPermLogin').textContent = account.login;
    $('accountPermGroup').textContent = group ? group.name : '-';
    var radio = document.querySelector('input[name="accountOverrideMode"][value="' + account.override + '"]');
    if (radio) radio.checked = true;
    renderPermissionTree('accountPermissionTree', group, account.override);
    openModal('accountPermissionModal');
  }

  function saveAccountPermission() {
    var account = accounts.find(function (item) { return item.id === selectedAccountId; });
    var selected = document.querySelector('input[name="accountOverrideMode"]:checked');
    if (account && selected) {
      account.override = selected.value;
      account.updatedAt = new Date().toISOString().slice(0, 10);
      renderAccounts();
    }
    closeModal('accountPermissionModal');
    notify('개별권한 설정이 저장되었습니다.');
  }

  function resetFilters() {
    $('filterType').value = '';
    $('filterActive').value = '';
    $('filterDefault').value = '';
    $('filterKeyword').value = '';
    renderGroups();
  }

  function bulkDelete() {
    var selected = Array.prototype.slice.call(document.querySelectorAll('[data-group-check]:checked')).map(function (input) {
      return input.getAttribute('data-group-check');
    });
    if (!selected.length) {
      notify('삭제할 그룹을 선택해 주세요.');
      return;
    }
    groups = groups.filter(function (group) {
      return selected.indexOf(group.id) < 0 || !canDelete(group);
    });
    renderGroups();
    notify('삭제 가능한 선택 그룹을 삭제했습니다.');
  }

  function init() {
    renderGroups();
    renderAccounts();

    $('groupForm').addEventListener('submit', saveGroup);
    document.addEventListener('change', handlePermissionChange);

    document.addEventListener('click', function (event) {
      var actionEl = event.target.closest('[data-group-action]');
      if (!actionEl) return;
      var action = actionEl.getAttribute('data-group-action');
      var id = actionEl.getAttribute('data-id');
      var group = id ? groupById(id) : null;
      var account = id ? accounts.find(function (item) { return item.id === id; }) : null;

      if (action === 'open-create') openGroupForm();
      if (action === 'edit' && group) openGroupForm(group);
      if (action === 'delete' && group) openDelete(group);
      if (action === 'permission' && group) openPermission(group);
      if (action === 'account-permission' && account) openAccountPermission(account);
      if (action === 'search') renderGroups();
      if (action === 'reset') resetFilters();
      if (action === 'bulk-delete') bulkDelete();
      if (action === 'confirm-delete') confirmDelete();
      if (action === 'save-permission') {
        closeModal('permissionModal');
        notify('그룹 권한 설정이 저장되었습니다.');
      }
      if (action === 'save-account-permission') saveAccountPermission();
      if (action === 'close-group') closeModal('groupModal');
      if (action === 'close-delete') closeModal('deleteModal');
      if (action === 'close-permission') closeModal('permissionModal');
      if (action === 'close-account-permission') closeModal('accountPermissionModal');
    });

    $('checkAllGroups').addEventListener('change', function () {
      document.querySelectorAll('[data-group-check]:not(:disabled)').forEach(function (input) {
        input.checked = $('checkAllGroups').checked;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.body.dataset.page === 'member_group_list') init();
  });
})();
